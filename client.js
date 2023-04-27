const form = document.getElementById('myForm');


function getConsumerCreditVerificationRequest() {
  // const form = document.getElementById("myForm");

  const productid = form.elements["productid"].value;
  const vendorflow = form.elements["vendorflow"].value;
  const testdata = form.elements["testdata"].value;

  const firstname = form.elements["firstname"].value;
  const lastname = form.elements["lastname"].value;
  const dob = form.elements["dob"].value;
  const ssn4 = form.elements["ssn4"].value;
  const addrline1 = form.elements["addrline1"].value;
  const addrline2 = form.elements["addrline2"].value;
  const city = form.elements["city"].value;
  const state = form.elements["state"].value;
  const zip = form.elements["zip"].value;
  const country = form.elements["country"].value;


  var default_firstname = 'Jeremy';
  var default_lastname = 'E';
  var default_dob = '1986-07-13';
  var default_ssn4 = '3418';
  var default_addrline1 = '98 crofton dr ';
  var default_addrline2 = 'West Seneca';
  var default_city = form.elements["city"].value;
  var default_state = form.elements["state"].value;
  var default_zip = '14224';
  var default_country = 'US'

  console.log("testdata is : ", testdata)

  if (testdata === "YES") {
    if (firstname && lastname && dob && ssn4 && addrline1 && addrline2 && city && state && zip && country) {
      default_firstname = firstname;
      default_lastname = lastname;
      default_dob = dob;
      default_ssn4 = ssn4;
      default_addrline1 = addrline1;
      default_addrline2 = addrline2;
      default_city = city;
      default_state = state;
      default_zip = zip;
      default_country = country;
      console.log("using test data")
    } else {
      alert("Use proper test data. We will use sample data for current request.")
    }
  }

  var request = `{
    "product": "CONSUMER_CREDIT",
    "intent": "VENMO_SOFT_ENQUIRY",
    "country_code": "${default_country}",
    "global_tracking_id": "d44da179-ed0b-40aa-a27e-c261e9b923e0",
    "application_auth_id": "56d2aa7c-fb38-4475-a98a-35cab904418f",
    "flow_source": "CREDIT_DIRECT_APPLICATION",
    "merchant_id": "1820978209738272980",
    "credit_primary_actor_type": "PAYPAL",
    "credit_authentication_type": "MEMBER",
    "party": {
      "type": "PERSONAL",
      "party_id": "1820978209738272980",
      "name": {
        "given_name": "${default_firstname}",
        "surname": "${default_lastname}"
      },
      "addresses": [
        {
          "address_line_1": "${default_addrline1}",
          "admin_area_2": "${default_addrline2}",
          "admin_area_1": "NY",
          "postal_code": "${default_zip}",
          "country_code": "${default_country}",
          "address_details": {
            "street_number": "98",
            "street_name": "CROFTON"
          },
          "type": "Residential"
        }
      ],
      "phones": [
        {
          "country_code": "1",
          "phone_entered": "7029129011",
          "confirmation_status": "null"
        }
      ],
      "date_of_birth": "${default_dob}",
      "document_identifiers": [
        {
          "value": "${default_ssn4}",
          "type": "TAX_ID",
          "sub_type": "SSN4"
        }
      ],
      "file_attributes": [],
      "ip_address": "166.194.188.110",
      "email_address": "evensj13@gmail.com",
      "net_monthly_income": {
        "currency_code": "USD",
        "value": "197188.00"
      }
    },
    "use_bureau_cache": false,
    "auth_received_hour": 11,
    "v66_ppc_ip_ad_dist_ind_num": "12",
    "uvs_workflow_name": "CREDIT_SOFT_ENQUIRY",
    "uvs_verification_purpose": "INDIVIDUAL_DATA"
  }`

  console.log("Verification request is \n", request)


// Parse the JSON text into an object
  const jsonObject = JSON.parse(request);

// Convert the JSON object to a pretty-printed string
  const requestBodyString = JSON.stringify(jsonObject, null, 4);
  console.log('Request Body: after stringify : \n', requestBodyString);
  response_element = document.getElementById('request')
  response_element.innerHTML = requestBodyString;

  return request
}

headers = {
  'Content-Type': 'application/json',
};

form.addEventListener('submit', function (event) {
  event.preventDefault();
  document.getElementById('response').innerHTML = null
  document.getElementById('response').innerHTML = null

  // const formData = new FormData(event.target);
  // const productid = formData.get('productid');

  fetch('http://localhost:3000/send-request', {
    method: 'POST',
    // mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: getConsumerCreditVerificationRequest()
  })
      .then(async response => {
        const responseBody = await response.json();
        const responseHeaders = await response.headers;

        if (response.ok) {

          console.log('Request sent successfully in client');
          console.log("Response OK at client is : \n", response)
          // console.log("Response.json() at client is : \n", response.json())
          console.log("Response.headers at client is : \n", response.headers)
          console.log("Response.headers at client is : \n", responseHeaders.values())
          for (const [name, value] of responseHeaders) {
            console.log(`${name}: ${value}`);
          }

          console.log("Response.body at client is : \n", response.body)
          console.log("Response.body at client is : \n", responseBody)

        } else {
          throw new Error('Error sending request in client');
        }
        return responseBody;
      })
      .then(async data => {
        // Convert the response body to a string and log it to the console
        // Beautify the JSON response and log it to the console
        const responseBodyString = JSON.stringify(data, null, 4);
        console.log('Response Body: after stringify : \n', responseBodyString);
        response_element = document.getElementById('response')
        response_element.innerHTML = responseBodyString;
      })
      .catch(error => {
        console.error("Caught this error while calling /send-request", error);
        // alert('Error sending request in client again');
      });
});
