export const newPasswordHtmlTemplate = ({
  name,
  token,
}) => `<h1>Reset password</h1>
<p>Hi there ${name}!</p>
<p>Click the next link to create a new password:</p>
<a href="http://localhost:8080/new-password/${token}">http://localhost:8080/new-password/${token}</a>`;
