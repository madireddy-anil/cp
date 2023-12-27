let hotjar = "";
const hotjar_development = `
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:2594113,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`;

const hotjar_test = ``;

const hotjar_production = `(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:3688161,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

//*DEV
if (process.env.NODE_ENV === "development") {
  hotjar = hotjar_development;
}

//*TST
if (process.env.NODE_ENV === "test") {
  hotjar = hotjar_test;
}

//*PRD
if (process.env.NODE_ENV === "production") {
  hotjar = hotjar_production;
}

export { hotjar };
