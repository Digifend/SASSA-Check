# SASSA Application Check

## Please note that this project may stop working if patched by SASSA
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

## Previous API Implementation

We used to use the following `GET` request endpoint to check the application status

```
GET https://srd.sassa.gov.za/srdweb/api/web/outcome/{{ID_Number}}/0600000000
```

The behavior of this endpoint was as follows:

1. **If there was an application, the response would be:**

    ```json
    {"messages": ["Phone number not found"]}
    ```

2. **If there was no application, the response would be:**

    ```json
    {"messages": ["party not found for ID number"]}
    ```

This approach has since been replaced by the current `POST` request implementation, as SASSA has changed the API on 14 October 2024

3. **New Response for both**

    ```json
    {"messages":["Invalid"]}
    ```
