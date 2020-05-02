/*----------------------------------- HOME CONTROLLER ------------------------------------------------------*/
// GET route der responderer med homepage
module.exports = (req , res) => {
    res.render('home', {
        title: 'Home',
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
};
