# SASSA Application Check

https://digifend.github.io/SASSA-Check/

![Check SASSA Infographic](https://raw.githubusercontent.com/Digifend/SASSA-Check/main/images/CheckSASSAInfographic.png)

*An infographic showing how or Check SASSA Website works*


This project uses a POST request to the Public SASSA API endpoint to verify the application status based on the provided ID number and mobile phone number.

## API Endpoint

The API endpoint used is:

```
POST https://srd.sassa.gov.za/srdweb/api/web/verified_otp
```

## Request Payload

The request payload sent to the API includes the following JSON structure:

```json
{
    "idnumber": "<ID_NUMBER>",
    "mobile": "0600000000"
}
```

- **idnumber**: The ID number is taken from the input box in our application.
- **mobile**: A static mobile number for the verification process (currently set as `0600000000`).

## Response Handling

The application handles responses from the API as follows:

1. **If the API responds with:**

    ```json
    {
        "messages": [
            "Invalid phone number for party"
        ]
    }
    ```

   This indicates that there is an application associated with the provided ID number.

2. **If the API responds with:**

    ```json
    {
        "messages": [
            "Invalid"
        ]
    }
    ```

   This means there is **no application** associated with the provided ID number.

