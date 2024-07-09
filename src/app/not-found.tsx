import Button from "@/components/Button/primary";

export default async function NotFound() {
  return (
    <section className="w-full h-auto lg:min-h-screen">
      <div className="container px-8 lg:mx-auto">
        <div className="inner h-auto min-h-[60vh] lg:min-h-[80vh] flex flex-col justify-center items-center">
          <h2 className="text-3xl leading-snug font-semibold text-center mb-8">
            Uh oh! 404
          </h2>
          <p className="text-gray-500 mb-10 text-center">
            We can&apos;t seem to find the page you&apos;re looking for.
          </p>

          <div className="flex flex-col flex-wrap space-x-0 space-y-2 md:flex-row md:space-y-0 justify-between md:space-x-4">
            <Button label="Back to Home" variant="primary" type="link" href="/" />
          </div>
        </div>
      </div>
    </section>
  )
}
