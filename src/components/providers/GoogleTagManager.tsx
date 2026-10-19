import Script from "next/script";
import { getGtmId } from "@/lib/constants";

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

/** Loads Google Tag Manager once when NEXT_PUBLIC_GTM_ID is a container id. */
export function GoogleTagManager() {
  const id = getGtmId();
  if (!GTM_ID_PATTERN.test(id)) return null;

  return (
    <>
      <Script id="rodha-gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){if(w.__rodhaGtm)return;w.__rodhaGtm=i;w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
