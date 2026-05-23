from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTPVerification
import random
import threading
import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import hashlib


# ── JWT Helper ─────────────────────────────────────────────────────────────────────
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


def get_avatar_url(email):
    """Generate a Gravatar URL based on the email address."""
    email_hash = hashlib.md5(email.strip().lower().encode('utf-8')).hexdigest()
    return f"https://www.gravatar.com/avatar/{email_hash}?d=identicon&s=150"
# ─────────────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def register_user(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response({"error": "Please provide all fields"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if active user exists
    if User.objects.filter(email=email, is_active=True).exists():
        return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Delete existing inactive user with same email to avoid duplicate/username conflicts
    User.objects.filter(email=email, is_active=False).delete()

    # Generate a unique username based on email
    username = email.split('@')[0]
    base_username = username
    suffix = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}_{suffix}"
        suffix += 1

    # Create inactive user (activated after OTP verification)
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=name,
        is_active=False
    )

    # Generate OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # Save or update OTP
    OTPVerification.objects.update_or_create(
        email=email,
        defaults={'otp': otp}
    )

    # Print OTP to server console logs as a fallback bypass for Render Free Tier SMTP outbound firewall restrictions
    print(f"[OTP BYPASS] Generated OTP for user '{email}' is: {otp}")

    # Send Email in a background thread to make registration instant
    subject = "Verify your ZoomX Account"
    
    # Plain text fallback
    plain_message = f"Hello {name},\n\nWelcome to ZoomX! Your verification code is: {otp}\n\nThis code will expire in 10 minutes."
    
    # Premium HTML Email Template
    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your ZoomX Account</title>
  <style>
    body {{
      background-color: #0A0A0F;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }}
    .wrapper {{
      width: 100%;
      background-color: #0A0A0F;
      padding: 40px 20px;
      box-sizing: border-box;
    }}
    .container {{
      max-width: 480px;
      margin: 0 auto;
      background-color: #111118;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #2D6FFF, #7B5CFF);
      padding: 35px 20px;
      text-align: center;
    }}
    .logo {{
      font-size: 30px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
      margin: 0;
    }}
    .content {{
      padding: 40px 30px;
      color: #c5c5d2;
      line-height: 1.6;
    }}
    h1 {{
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }}
    p {{
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 24px;
      color: #a0a0b8;
    }}
    .otp-container {{
      background: linear-gradient(135deg, rgba(45, 111, 255, 0.05), rgba(123, 92, 255, 0.05));
      border: 1px solid rgba(123, 92, 255, 0.25);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }}
    .otp-code {{
      font-family: "Courier New", Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #82AAFF;
      margin: 0;
      padding-left: 8px;
    }}
    .info-box {{
      font-size: 12px;
      color: #70708f;
      border-left: 3px solid #7B5CFF;
      padding-left: 12px;
      margin-bottom: 30px;
    }}
    .footer {{
      background-color: #0C0C12;
      padding: 25px 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      text-align: center;
      font-size: 11px;
      color: #55556d;
    }}
    .footer a {{
      color: #82AAFF;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">ZoomX</div>
      </div>
      <div class="content">
        <h1>Welcome to ZoomX, {name}!</h1>
        <p>We are thrilled to have you join us. Before you can start hosting and joining ultra-fast, premium meetings, we just need to verify your email address.</p>
        
        <p>Please enter the following 6-digit verification code in your browser window:</p>
        
        <div class="otp-container">
          <div class="otp-code">{otp}</div>
        </div>
        
        <div class="info-box">
          This code is valid for <strong>10 minutes</strong>. If you did not sign up for a ZoomX account, you can safely ignore this email.
        </div>
        
        <p>See you in the room,<br><strong>The ZoomX Team</strong></p>
      </div>
      <div class="footer">
        © 2026 ZoomX Inc. All rights reserved.<br>
        Questions? Contact us at <a href="mailto:support@zoomx.app">support@zoomx.app</a>
      </div>
    </div>
  </div>
</body>
</html>"""

    def send_email_async():
        try:
            send_mail(
                subject,
                plain_message,
                'noreply@zoomx.app',
                [email],
                fail_silently=False,
                html_message=html_content
            )
        except Exception as e:
            print(f"Failed to send email in background: {str(e)}")

    threading.Thread(target=send_email_async).start()

    return Response({"message": "Verification code sent to email"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response({"error": "Please provide email and verification code"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        verification = OTPVerification.objects.get(email=email)
    except OTPVerification.DoesNotExist:
        return Response({"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)

    if verification.otp != otp:
        return Response({"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)

    if verification.is_expired():
        return Response({"error": "Verification code has expired. Please register again."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.is_active = True
        user.save()

        # Clean up OTP record
        verification.delete()

        # Generate JWT tokens for the newly verified user
        return Response({
            "message": "Verification successful",
            "user": {
                "email": user.email,
                "name": user.first_name,
                "avatar": get_avatar_url(user.email)
            },
            "tokens": get_tokens(user)
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Please provide email and password"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if user exists
        user_obj = User.objects.get(email=email)
        if not user_obj.is_active:
            return Response({"error": "Please verify your email first."}, status=status.HTTP_403_FORBIDDEN)
        
        # Authenticate
        user = authenticate(username=user_obj.username, password=password)
        if user is not None:
            return Response({
                "message": "Login successful",
                "user": {
                    "email": user.email,
                    "name": user.first_name,
                    "avatar": get_avatar_url(user.email)
                },
                "tokens": get_tokens(user)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

    email = None
    name = ""
    picture = ""

    # Check if token is a JWT (ID Token)
    if token.startswith("ey"):
        google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
        if not google_client_id:
            return Response({"error": "Google Client ID is not configured on server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)
            email = idinfo.get('email')
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')
        except ValueError as e:
            return Response({"error": f"Invalid Google ID token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Treat as access token and fetch from Google UserInfo API
        try:
            resp = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"}
            )
            if resp.status_code != 200:
                return Response({"error": "Invalid Google access token"}, status=status.HTTP_400_BAD_REQUEST)
            info = resp.json()
            email = info.get('email')
            name = info.get('name', '')
            picture = info.get('picture', '')
        except Exception as e:
            return Response({"error": f"Failed to verify access token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    if not email:
        return Response({"error": "Could not retrieve email from Google"}, status=status.HTTP_400_BAD_REQUEST)

    # Generate a unique username based on email
    username = email.split('@')[0]
    base_username = username
    suffix = 1
    while User.objects.filter(username=username).exists():
        existing_user = User.objects.filter(username=username).first()
        if existing_user and existing_user.email == email:
            break
        username = f"{base_username}_{suffix}"
        suffix += 1

    # Find user or create if they don't exist
    user, created = User.objects.get_or_create(email=email, defaults={
        'username': username,
        'first_name': name,
        'is_active': True
    })

    if not created and not user.is_active:
        user.is_active = True
        user.save()

    return Response({
        "message": "Login successful",
        "user": {
            "email": user.email,
            "name": user.first_name,
            "avatar": picture if picture else get_avatar_url(user.email)
        },
        "tokens": get_tokens(user)
    }, status=status.HTTP_200_OK)
