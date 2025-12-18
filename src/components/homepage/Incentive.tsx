
import incentives from "@/assets/incentives.png";

function Incentive() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

    <div className="mt-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <img
              src={incentives}
              alt="Incentives"
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
            {/* badge */}
            <div className="inline-block bg-primary text-white px-6 py-4 rounded-full mb-4">
              <span className="text-sm font-semibold flex items-center gap-2">
                {" "}
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1145_18488)">
                    <path
                      d="M11.99 2.15234C6.47 2.15234 2 6.63234 2 12.1523C2 17.6723 6.47 22.1523 11.99 22.1523C17.52 22.1523 22 17.6723 22 12.1523C22 6.63234 17.52 2.15234 11.99 2.15234ZM16.23 18.1523L12 15.6023L7.77 18.1523L8.89 13.3423L5.16 10.1123L10.08 9.69234L12 5.15234L13.92 9.68234L18.84 10.1023L15.11 13.3323L16.23 18.1523Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1145_18488">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.152344)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                New Seller Incentives
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Get started with over <br /> ₦50, 000 in incentives
            </h2>
            <p className="text-muted-foreground mb-4">
              As a new seller, you can take advantage of a series of incentives.
            </p>
            <div className="p-8 bg-[#DDF9D4] rounded-lg mb-6">
              {/* 4 checklist with svg icon*/}
              <ul className="list-disc list-inside space-y-4 text-black font-light">
                <li className="flex items-center gap-2 ">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Free listing credits for your first month
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Access to premium support for the first three months
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3327 4.15234L5.99935 11.4857L2.66602 8.15234"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Marketing credits to boost your listings
                </li>
              </ul>
            </div>
          
          </div>
        </div>
    </main>

  )
}

export default Incentive
