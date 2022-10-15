module.exports.handleSignIn = (req, res, db, bcrypt) => {
    let { email, password } = req.body; //destructure body for easier access

    if (!email || !password) {
        return res.status(400).json('Invalid form entry');
    }

    //knex select from where
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            console.log('logging in');

            //Synchronous hash compare
            const isValid = bcrypt.compareSync(password, data[0].hash);

            if (isValid) {
                console.log('pass match');
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user)
                    })
                    .catch(err => res.status(400).json('Cannot get user'))
            } else {
                res.status(400).json('Login error: email or password wrong')
            }

        })
        .catch(err => res.status(400).json('Login error: email or password wrong'))
}