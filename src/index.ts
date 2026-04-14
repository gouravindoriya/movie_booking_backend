import 'dotenv/config'
import createExpressApplication from './app/index.js'

async function main(){
    try {
        const app=createExpressApplication()
        app.listen(3000,()=>{
            console.log("http server running on port 3000")
        })
    } catch (error) {
        console.log
    }
}

main()

