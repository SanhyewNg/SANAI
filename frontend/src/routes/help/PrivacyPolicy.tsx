import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Tooltip as ReactTooltip } from "react-tooltip"
import FooterMark from "../../components/FooterMark"

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex w-full justify-center border-b border-gray-200 dark:border-gray-800  shadow-md mb-1">
        <div className="flex mt-8 w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            {/* Go to Help Home */}
            <Link
              to="/help"
              className="m-2 p-2 rounded-full hover:invert dark:hover:invert-0 hover:bg-gray-300 dark:hover:bg-gray-600"
              data-tooltip-id="back-to-home"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ReactTooltip
              id="back-to-home"
              place="left"
              content="Back to Help Home"
            />

            <img
              className="h-6 w-6 invert dark:invert-0"
              src="/assets/icons/privacy.svg"
              alt="Icon"
            />
            <span className="ml-2 text-2xl font-bold">Privacy Policy</span>
          </div>
        </div>
      </header>

      <div className="flex-1 h-full w-full overflow-y-auto p-4">
        <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl mx-auto">
          {/* <h2 className="text-lg font-semibold">Privacy Policy</h2> */}
          <p>
            This Privacy Policy ("Policy") explains how SANAI ("we," "us," or
            "our") collects, uses, and protects the personal information of
            users ("you" or "your") when you use the SANAI application ("App").
            This Policy applies to the information collected through the App and
            its related services.
          </p>

          <ol className="list-decimal ml-5" key={"upper"}>
            <li>
              <h3 className="font-bold">Information We Collect</h3>
              <ol className="list-disc ml-5">
                <li>
                  <strong>Personal Information:</strong> We may collect personal
                  information that you voluntarily provide when using the App,
                  such as your name, email address, and any other information
                  you choose to provide.
                </li>
                <li>
                  <strong>Usage Information:</strong> We may collect information
                  about your interactions with the App, including log files, app
                  usage data, and device information (e.g., device type,
                  operating system, unique device identifiers).
                </li>
                <li>
                  <strong>Data:</strong> When you engage in conversations or
                  interact with the App, we may collect and retain the content
                  of those communications for the purpose of improving the App's
                  functionality and performance.
                </li>
              </ol>
            </li>

            <li>
              <h3 className="font-bold">Use of Information</h3>
              <ol className="list-disc ml-5">
                <li>
                  <strong>Provide and Improve the App:</strong> We may use the
                  collected information to provide you with the App's services,
                  personalize your experience, improve the App's features, and
                  develop new functionalities.
                </li>
                <li>
                  <strong>Communication:</strong> We may use your contact
                  information to respond to your inquiries, provide support, and
                  communicate important notices regarding the App.
                </li>
                <li>
                  <strong>Analytics and Research:</strong> We may use aggregated
                  and anonymized data for analytical purposes, such as
                  understanding user behavior, trends, and preferences, to
                  enhance the App's performance and user experience.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> We may process and disclose
                  your information as required by applicable laws, regulations,
                  or legal proceedings.
                </li>
              </ol>
            </li>

            <li>
              <h3 className="font-bold">Data Sharing and Disclosure</h3>
              <ol className="list-disc ml-5">
                <li>
                  <strong>Service Providers:</strong> We may engage trusted
                  third-party service providers to assist us in providing and
                  maintaining the App. These providers may have access to your
                  personal information for the sole purpose of performing their
                  services on our behalf.
                </li>
                <li>
                  <strong>Compliance with Law:</strong> We may disclose your
                  information if required by law, legal process, or governmental
                  request, or to protect our rights, privacy, safety, or
                  property, or that of others.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of all or a portion of our assets, your
                  information may be transferred to the acquiring entity.
                </li>
              </ol>
            </li>

            <li>
              <h3 className="font-bold">Data Security</h3>
              <p>
                We take reasonable measures to protect your information from
                unauthorized access, disclosure, alteration, or destruction.
                However, please be aware that no security measures are perfect
                or impenetrable, and we cannot guarantee the absolute security
                of your information.
              </p>
            </li>

            <li>
              <h3 className="font-bold">Third-Party Links and Services</h3>
              <p>
                The App may contain links to third-party websites or services
                that are not controlled or operated by us. This Privacy Policy
                does not apply to such third-party services, and we are not
                responsible for their privacy practices. We encourage you to
                review the privacy policies of these third parties before
                providing any personal information.
              </p>
            </li>

            <li>
              <h3 className="font-bold">Children's Privacy</h3>
              <p>
                The SANAI App is not intended for use by individuals under the
                age of 18. We do not knowingly collect personal information from
                children. If you become aware that your child has provided us
                with personal information without your consent, please contact
                us, and we will promptly delete such information from our
                systems.
              </p>
            </li>

            <li>
              <h3 className="font-bold">Changes to this Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be effective immediately upon posting the revised Policy in
                the App. We encourage you to review this Policy periodically to
                stay informed about how we collect, use, and protect your
                information.
              </p>
            </li>
          </ol>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
