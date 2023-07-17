# Random Secure String Generator
```
<!-- nodejs console -->
require('crypto').randomBytes(32).toString('hex')
```

# Random Secure String Generator
```
<!-- nodejs js file -->
const crypto = require('crypto');
const randomString = crypto.randomBytes(32).toString('hex');
console.log(randomString);
```