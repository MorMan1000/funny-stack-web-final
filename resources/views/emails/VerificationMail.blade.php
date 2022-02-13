<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test Mail</title>
</head>
<body>
  <h1>You have successfully signed up to funny stack</h1>
  <p><strong>Hello {{ $details['name'] }}!! </strong> <br/> you are almost done, click here to verify your account:</p>
  <form method="POST" action="{{  $details['verify-link'] }}">
    @method('PUT')
    <button type="submit">Click</button>
  </form>
  <p>Thank you</p>
</body>
</html>