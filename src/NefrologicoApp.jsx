import { AppRouter } from "./router/AppRouter"

export const NefrologicoApp = () =>{
    return(       
        <>
                <main className="container-fluid pb-3 pb-sm-4">
                    <section className="cs-offcanvas-enabled row pb-3 pb-md-4">
                        <div className="col-xl-9">
                            <AppRouter/>
                        </div>
                    </section>
                 </main>
        </>
    )
}