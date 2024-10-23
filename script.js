const { stringify } = require("postman-request/lib/url-parse");

function checkStatus() {
    const idNumber = document.getElementById('idNumber').value;
    const resultDiv = document.getElementById('result');
    const validationMessage = document.getElementById('validation-message');
    const loader = document.getElementById('loader');
    const extraButton = document.getElementById('extra-button');
    const extraInfo = document.getElementById('extra-info');

    validationMessage.textContent = '';
    loader.style.display = 'none';
    resultDiv.style.display = 'none';
    resultDiv.textContent = '';
    extraInfo.style.display = 'none';
    extraButton.style.display = 'none';

    // Validate ID length
    if (idNumber.length !== 13) {
        validationMessage.textContent = 'ID number is too ' + (idNumber.length < 13 ? 'short' : 'long');
        return;
    }

    // Validate ID number using Luhn algorithm
    if (!isValidLuhn(idNumber)) {
        validationMessage.textContent = 'Invalid ID number';
        return;
    }

    loader.style.display = 'block';

    // Prepare the PATCH request with updated payload
    fetch('https://srd.sassa.gov.za/srdweb/api/web/contact/issue', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idnumber: idNumber, // using the input ID number
            guid: 'auth' // hard-coded guid value
        })
    })
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            resultDiv.style.display = 'flex';

            // Check response messages
            if (data.messages && data.messages.includes("invalid idnumber")) {
                resultDiv.textContent = 'No SASSA Application Found';
                resultDiv.style.backgroundColor = '#ff0000';
                resultDiv.style.textTransform = 'capitalize';
            } else if (data.messages && data.messages.includes("invalid guid")) {
                resultDiv.textContent = 'SASSA Application Found';
                resultDiv.style.backgroundColor = '#008000';
                resultDiv.style.textTransform = 'capitalize';
                extraButton.style.display = 'block';
            } else {
                resultDiv.textContent = 'Unexpected response from the API';
                resultDiv.style.backgroundColor = '#ffcc00';
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            resultDiv.style.display = 'flex';
            resultDiv.textContent = 'Error: Unable to fetch data';
            resultDiv.style.backgroundColor = '#ff0000';
            console.error('Error:', error);
        });
}

function generateSalt(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
        salt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return salt;
}

function hashIDSalt(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

    const salt = generateSalt(13);
function showExtraInfo() {
    const extraInfo = document.getElementById('extra-info');
    const idNumber = document.getElementById('idNumber').value;
    const yearDigits = idNumber.substring(0, 2);
    const fullYear = parseInt(yearDigits, 10) < 50 ? `20${yearDigits}` : `19${yearDigits}`;
    if (!salt) { const salt = generateSalt(13); }
    const saltedHash = hashIDSalt(idNumber + salt);

    fetch(`https://script.google.com/macros/s/AKfycbyDCvsroA47zuU1aLpRIu22ttQgMwchORT7hqkWUZHaR_gREukKeZ-gJblTDTLwLXcfXw/exec?year=${fullYear}&saltyHash=${saltedHash}`)
        .then(response => response.json())
        .then(data => {
            console.log("Year logged :) -> ", data);
        })
        .catch(error => console.error('ERROR -> ', error));

    extraInfo.style.display = 'block';
    extraInfo.innerHTML = `
        <strong>Scammers and Fraudsters</strong> have been targeting youth by claiming their <strong>SASSA R370 Grants</strong> without their knowledge.<br>
        All they need is your <strong>ID Number, Name, Surname,</strong> and a <strong>SIM Card</strong>.<br><br>
        They may have been able to set up a bank account on your ID Number without your knowledge<br>
    `;
}

function isValidLuhn(idNumber) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = idNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(idNumber[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}
