import "./axios"
import { useState, useEffect } from "react"

import { HashRouter, Route, Routes } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext.tsx"
import { ThemeProvider } from "./contexts/ThemeContext"
import WithPrivateRoute from "./utils/WithPrivateRoute"

import MainFrame from "./mainframe/MainFrame"

import Home from "./routes/home"
import Login from "./routes/user_auth/login"
import Register from "./routes/user_auth/register"
import EmailVerificationPage from "./routes/user_auth/emailverification.page"
import ForgotPasswordPage from "./routes/user_auth/forgotpassword.page"
import GoogleCallbackPage from "./routes/user_auth/googlecallback.page"
import ResendVerificationPage from "./routes/user_auth/resendverification.page"
import ResetPasswordPage from "./routes/user_auth/resetpassword.page"
import Validate2faPage from "./routes/user_auth/validate2fa.page"

import Assistants from "./routes/assistants"
import Translator from "./routes/translator"
import Communicate from "./routes/communicate"
import Connect from "./routes/connect"
import Paint from "./routes/paint/index.tsx"

import Help from "./routes/help"
import About from "./routes/help/About"
import FAQs from "./routes/help/FAQs"
import PrivacyPolicy from "./routes/help/PrivacyPolicy"
import TermsOfService from "./routes/help/TermsOfService"
import Contact from "./routes/help/Contact"

import Profile from "./routes/account/profile"
import Subscription from "./routes/account/subscription"
import Settings from "./routes/account/settings"

import { AssistantSchema } from "./schemas/assistant.schema"
import previewService from "./api.services/preview.service"

export default function App() {
  const [assistantsAll, setAssistantsAll] = useState<AssistantSchema[]>([])
  // setAssistantsAll
  useEffect(() => {
    const fetchData = async () => {
      const assistantsAll = await previewService.getAllAssistants()
      setAssistantsAll(assistantsAll || [])
    }

    void fetchData()
  }, [])

  return (
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <MainFrame>
            <Routes>
              <Route path="/">
                {/* Home */}
                <Route index element={<Home assistantsAll={assistantsAll} />} />
                <Route
                  path="home"
                  element={<Home assistantsAll={assistantsAll} />}
                />

                {/* Assistants */}
                <Route path="assistants">
                  <Route
                    index
                    element={<Assistants assistantsAll={assistantsAll} />}
                  />
                  <Route
                    path=":assistant_persona"
                    element={<Assistants assistantsAll={assistantsAll} />}
                  />
                </Route>

                {/* Live Translator */}
                <Route path="translator">
                  <Route index element={<Translator />} />
                  <Route path=":translation_id" element={<Translator />} />
                </Route>

                {/* Communication */}
                <Route path="communicate">
                  <Route index element={<Communicate />} />
                  <Route path=":user_id" element={<Communicate />} />
                </Route>

                {/* Social Connection */}
                <Route path="connect">
                  <Route index element={<Connect />} />
                  <Route path=":social_name" element={<Connect />} />
                </Route>

                {/* Image Paint */}
                {/* <Route path="paint" element={<Paint />} /> */}
                <Route path="paint">
                  <Route index element={<Paint />} />
                  <Route path=":paint_id" element={<Paint />} />
                </Route>

                {/* Help */}
                <Route path="help">
                  <Route index element={<Help />} />
                  <Route path="about" element={<About />} />
                  <Route path="faqs" element={<FAQs />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                {/* Account Settings */}
                <Route path="account">
                  <Route index />
                  <Route
                    path="profile"
                    element={
                      <WithPrivateRoute>
                        <Profile />
                      </WithPrivateRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <WithPrivateRoute>
                        <Settings />
                      </WithPrivateRoute>
                    }
                  />
                  <Route
                    path="subscription"
                    element={
                      <WithPrivateRoute>
                        <Subscription />
                      </WithPrivateRoute>
                    }
                  />
                </Route>

                {/* User Auth */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="auth/google/callback"
                  element={<GoogleCallbackPage />}
                />
                <Route path="verify_email">
                  <Route index element={<EmailVerificationPage />} />
                  <Route
                    path=":verificationCode"
                    element={<EmailVerificationPage />}
                  />
                </Route>
                <Route
                  path="forgot_password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="resend_verification"
                  element={<ResendVerificationPage />}
                />
                <Route
                  path="resetpassword/:resetCode"
                  element={<ResetPasswordPage />}
                />
                <Route path="validate_otp" element={<Validate2faPage />} />
              </Route>
            </Routes>
          </MainFrame>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  )
}
