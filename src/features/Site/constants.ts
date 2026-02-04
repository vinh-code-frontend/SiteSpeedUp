export const APP_REG_NEW_CONST = [
  {
    title: 'Title',
    sample: 'SSU App'
  },
  {
    title: 'App Domain',
    sample: 'www.localhost.com'
  },
  {
    title: 'Redirect URI',
    sample: 'https://localhost.com'
  }
];

export const APP_PERMISSION_XML = `<AppPermissionRequests AllowAppOnlyPolicy="true"><AppPermissionRequest Scope="https://sharepoint/content/sitecollection/web" Right="FullControl" /></AppPermissionRequests>`;
export const APP_PERMISSION_XML_DISPLAY = `
<AppPermissionRequests
  AllowAppOnlyPolicy="true">
  <AppPermissionRequest
    Scope="https://sharepoint/content/sitecollection/web"
    Right="FullControl"
  />
</AppPermissionRequests>`;
