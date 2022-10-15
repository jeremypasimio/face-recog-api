module.exports.getProfile = (req, res, db) => {

    let { id } = req.params;

    //knex select from where
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length) {
            res.json(user);
        } else {
            res.status(400).json('User not found');
        }

    })
        .catch(err => res.status(400).json('Somethiung went wrong'))
}

module.exports.incrementImage = (req, res,db) => {
    //knex increment
    db('users').where('id', '=', req.body.id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('Error getting entries'))
}