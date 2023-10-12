import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Container className="flex flex-col items-center justify-center mt-28 md:mt-40 mb-12 text-center">
        <div className="bg-white max-w-fit mx-auto flex items-center justify-center space-x-2 py-2 px-7 mb-4 border border-gray-200 rounded-full shadow-md backdrop-blur overflow-hidden transition-all hover:bg-white/50 hover:border-gray-300">
          <p className="text-sm text-gray-700 font-semibold">
            Quill is now public
          </p>
        </div>

        <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold">
          Chat with your <span className="text-blue-600">documents</span> in
          seconds.
        </h1>

        <p className="max-w-prose mt-5 text-zinc-700 md:text-lg">
          Quill allows you to have conversations with any PDF document. Simply
          upload your file and start asking questions right away.
        </p>

        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
          href="/dashboard"
          target="_blank"
        >
          Get started <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </Container>

      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 pointer-events-none overflow-hidden blur-3xl transform-gpu sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative w-[36.125rem] left-[calc(50%-11rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="mt-16 sm:mt-24 flow-root">
                <div className="bg-gray-900/5 p-2 -m-2 rounded-xl ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:p-4 lg:rounded-2xl">
                  <Image
                    className="bg-white p-2 sm:p-8 md:p-20 ring-1 ring-gray-900/10 shadow-2xl rounded-md"
                    src="/dashboard-preview.jpeg"
                    width={1364}
                    height={866}
                    quality={100}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 pointer-events-none overflow-hidden blur-3xl transform-gpu sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative w-[36.125rem] left-[calc(50%-13rem)] aspect-[1155/678] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto my-32 sm:mt-52">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 mb-12 sm:text-center">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mt-2 font-bold">
            Start chatting in minutes
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Chatting with your PDF file has never been easier than with Quill.
          </p>
        </div>

        <ol className="space-y-4 my-8 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col gap-2 py-2 pl-4 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pt-4 md:pb-0 md:pl-0">
              <span className="text-sm text-blue-600 font-medium">Step 1</span>

              <span className="text-xl font-semibold">
                Sign up for an account
              </span>

              <span className="mt-2 text-zinc-700">
                Either starting out with a free plan or choose a{" "}
                <Link
                  href="/pricing"
                  className="text-blue-700 underline underline-offset-2"
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>

          <li className="md:flex-1">
            <div className="flex flex-col gap-2 py-2 pl-4 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pt-4 md:pb-0 md:pl-0">
              <span className="text-sm text-blue-600 font-medium">Step 2</span>

              <span className="text-xl font-semibold">
                Upload your PDF file
              </span>

              <span className="mt-2 text-zinc-700">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>

          <li className="md:flex-1">
            <div className="flex flex-col gap-2 py-2 pl-4 border-l-4 border-zinc-300 md:border-l-0 md:border-t-2 md:pt-4 md:pb-0 md:pl-0">
              <span className="text-sm text-blue-600 font-medium">Step 3</span>

              <span className="text-xl font-semibold">
                Start asking questions
              </span>

              <span className="mt-2 text-zinc-700">
                it&apos;s that simple. Try out Quill today - it really takes
                less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mt-16 sm:mt-24 flow-root">
            <div className="bg-gray-900/5 p-2 -m-2 rounded-xl ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:p-4 lg:rounded-2xl">
              <Image
                className="bg-white p-2 sm:p-8 md:p-20 ring-1 ring-gray-900/10 shadow-2xl rounded-md"
                src="/file-upload-preview.jpeg"
                width={1419}
                height={732}
                quality={100}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
