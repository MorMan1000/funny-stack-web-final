<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
  <h1>Your account email address has been updated</h1>
  <p><strong>Hello {{ $details['name'] }}!! </strong> <br/> Your email address for your account has been changed:</p>    
  <p>Current Email: {{ $details['newEmail'] }}</p>
  <p>Previous Email: {{ $details['oldEmail'] }}</p>
</body>
</html>