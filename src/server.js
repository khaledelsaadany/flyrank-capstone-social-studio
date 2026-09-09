const {createApp}=require('./app');
const config=require('./config');
const {getDatabase}=require('./db/connection');
const app=createApp();
getDatabase();
app.listen(config.port,()=>console.log(`Social Media Studio listening on http://localhost:${config.port}`));
