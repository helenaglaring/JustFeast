
/*----------------------------------- ERROR PAGE------------------------------------------------------*/
// Rendering error page for http-status 404 og 500 errors
module.exports = (req,res)=>{
    res.render('error');
};