import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`LetBy backend running: http://localhost:${env.PORT}`);
});
