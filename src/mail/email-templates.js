export const newPasswordHtmlTemplate = ({
  name,
  token,
}) => `<h1>Reset password</h1>
<p>Hi there ${name}!</p>
<p>Click the next link to create a new password:</p>
<a href="http://localhost:8080/new-password/${token}">http://localhost:8080/new-password/${token}</a>`;

export const accountDeletedHtmlTemplate = ({
  name,
}) => `<h1>Account deleted</h1>
<p>Hi there ${name},</p>
<p>Your account will be deleted due to inactivity.</p>
<p>Please contact us in case you want to preserve your account.</p>`;

export const productDeletedHtmlTemplate = ({
  name,
  productId,
  productName: productTitle,
}) => `<h1>Product deleted</h1>
<p>Hi there ${name},</p>
<p>Your Product ${productId}: "${productTitle}" has been deleted for the system administrator.</p>`;
