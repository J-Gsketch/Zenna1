# API & Webhooks Documentation — Zenna by Hammer & Code

This document outlines all public endpoints and webhook protocols available in **Zenna by Hammer & Code**.

---

## REST Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Authentication**: None
- **Response**:
  ```json
  { "status": "ok", "product": "Zenna by Hammer & Code", "db": "Firestore Active" }
  ```

### 2. Business Configuration
- **Endpoint**: `GET /api/business-config` / `POST /api/business-config`
- **Authentication**: ****** (Firebase Auth)
- **POST Payload**:
  ```json
  {
    "businessName": "Auckland Pro Plumbing",
    "ownerName": "Dave",
    "ownerPhone": "+64210000000",
    "calloutFee": "$150",
    "region": "NZ",
    "currency": "NZD",
    "plan": "Pro Team"
  }
  ```

### 3. Subscription & Checkout Creation
- **Endpoint**: `POST /api/create-subscription`
- **Authentication**: ******
- **Payload**:
  ```json
  {
    "planId": "pro",
    "currency": "AUD",
    "billingInterval": "monthly",
    "businessName": "Sydney Metro Electrical"
  }
  ```

### 4. Plans & Feature Matrix
- **Endpoint**: `GET /api/plans`
- **Authentication**: None
- **Response**: Returns JSON schema of all tiers (Starter, Pro, Enterprise) and feature comparison matrix.

---

## Telephony Webhooks

### 1. Missed Call Webhook
- **Endpoint**: `POST /webhook/missed-call`
- **Trigger**: Incoming call from Twilio.
- **Action**: Generates personalized AI text-back SMS and logs lead into database.

### 2. Incoming SMS Webhook
- **Endpoint**: `POST /webhook/sms`
- **Trigger**: Incoming SMS message from Twilio.
- **Action**: Formats trade-calibrated response under 120 characters and replies to customer.
