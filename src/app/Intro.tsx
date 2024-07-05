import Button from "@/components/Button/primary";

export default function Intro() {
    return (
        <section className="w-full h-auto min-h-screen">
            <div className="container mx-auto">
                <div className="inner h-auto min-h-[80vh] flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-semibold text-center mb-8">Nisi vel eos rerum molestiae eum eveniet.</h2>
                    <p className="text-gray-500 mb-10">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam sit voluptatibus</p>

                    <div className="flex justify-between space-x-4">
                        <Button label="Login" variant="secondary" type="link" href="/login" />
                        <Button label="Sign Up" variant="primary" type="link" href="/register" />
                    </div>
                </div>
            </div>
      </section>
    )
}