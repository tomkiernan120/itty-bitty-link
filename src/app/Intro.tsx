import Button from "@/components/Button/primary";

export default function Intro() {
    return (
        <section className="w-full h-auto lg:min-h-screen">
            <div className="container px-8 lg:mx-auto">
                <div className="inner h-auto min-h-[60vh] lg:min-h-[80vh] flex flex-col justify-center items-center">
                    <h2 className="text-3xl leading-snug font-semibold text-center mb-8">Links are just far too darn long!</h2>
                    <p className="text-gray-500 mb-10 text-center">Itty Bitty link helps you change that</p>

                    <div className="flex flex-col flex-wrap space-x-0 space-y-2 md:flex-row md:space-y-0 justify-between md:space-x-4">
                        <Button label="Login" variant="secondary" type="link" href="/login" />
                        <Button label="Sign Up" variant="primary" type="link" href="/register" />
                    </div>
                </div>
            </div>
      </section>
    )
}