module.exports.handleRegister = (req, res, db, bcrypt) => {

    const { name, email, password } = req.body; //destructure for easy access
    if (!email || !name || !password) {
        return res.status(400).json('Invalid form entry');
    }
    //hash password entry with bcrypt
    const hash = bcrypt.hashSync(password);

    //knex transaction
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to register'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to register'))

}