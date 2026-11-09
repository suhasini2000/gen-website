import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClerkProvider, Show, SignIn, SignUp } from "@clerk/react";
import { Layout } from "@/components/layout/Layout";
import { StandardPage } from "@/components/common";
import { API } from "@/lib/site";
import AdminDashboard from "./AdminDashboard";

function SignedOut() {
  const signingUp = useLocation().pathname.startsWith("/admin-sign-up");
  return (
    <StandardPage eyebrow="Owner area" title={signingUp ? "Create owner account" : "Admin sign-in"}>
      <div className="auth-wrap" data-testid={signingUp ? "admin-signup" : "admin-signin"}>
        {signingUp ? <SignUp routing="path" path="/admin-sign-up" signInUrl="/admin" forceRedirectUrl="/admin" /> : <SignIn routing="path" path="/admin" signUpUrl="/admin-sign-up" forceRedirectUrl="/admin" />}
      </div>
    </StandardPage>
  );
}

export default function AdminGate() {
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();
  useEffect(() => { fetch(`${API}/clerk/config`).then((r) => r.json()).then(setConfig).catch(() => {}); }, []);
  if (!config?.enabled) return <Layout><StandardPage eyebrow="Owner area" title="Admin sign-in"><p className="lead">Admin sign-in is being prepared. Please refresh in a moment.</p></StandardPage></Layout>;
  return (
    <ClerkProvider publishableKey={config.publishable_key} routerPush={(to) => navigate(to)} routerReplace={(to) => navigate(to, { replace: true })} signInUrl="/admin" signUpUrl="/admin-sign-up" afterSignOutUrl="/admin">
      <Layout>
        <Show when="signed-in"><AdminDashboard /></Show>
        <Show when="signed-out"><SignedOut /></Show>
      </Layout>
    </ClerkProvider>
  );
}
