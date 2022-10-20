const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    console.log('rentrée dans createSauce');
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;

    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.usersLiked = [];
    sauce.usersDisliked = [];
    console.log('sauce : '+sauce);
    sauce.save()
      .then(() => {res.status(201).json({ message: 'Sauce enregistrée !'})})
      .catch(error => {res.status(400).json({ error })});
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Unauthorized request'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                    .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'Unauthorized request'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
    console.log('rentrée dans getOneSauce');
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            res.status(200).json(sauce);
        })
        .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    console.log('rentrée dans getAllSauces');
    Sauce.find()
        .then(sauces => {
            console.log(sauces);
            res.status(200).json(sauces)})
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    console.log('Je suis dans le controler like');

    // affichage du req.body
    console.log('Contenu req.body - ctrl like');
    console.log(req.body);


    // récupérer l'id dans l'url de la requête
    console.log('Contenu req.params.id - ctrl like');
    console.log(req.params);

    // mise au format de l'id pour aller chercher l'objet dans la BDD
    console.log("transformer l'id en _id");
    console.log({_id: req.params.id});

    // aller chercher l'objet dans la BDD
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        console.log('contenu résultat promesse: sauce');
        console.log(sauce);



    if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log("userId n'est pas dans BDD et requête front like égale à 1");
    

    // mise à jour sauce BDD
    Sauce.updateOne(
        {_id: req.params.id},
        {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId}
        }
        )
        .then(() => res.status(201).json({message: 'sauce like +1'}))
        .catch((error) => res.status(400).jason({error}));

    }

    // like = 0 (likes = 0, pas de vote)
    if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        console.log("userId est dans usersLiked et requête front like égale à 0");
    

    // mise à jour sauce BDD
    Sauce.updateOne(
        {_id: req.params.id},
        {
            $inc: {likes: -1},
            $pull: {usersLiked: req.body.userId}
        }
        )
        .then(() => res.status(201).json({message: 'sauce like -1'}))
        .catch((error) => res.status(400).jason({error}));

    }

    // like = -1 (dislikes = +1)
    if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        console.log("userId n'est pas dans BDD et requête front dislike égale à 1");
    

    // mise à jour sauce BDD
    Sauce.updateOne(
        {_id: req.params.id},
        {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId}
        }
        )
        .then(() => res.status(201).json({message: 'sauce dislike +1'}))
        .catch((error) => res.status(400).jason({error}));

    }


    // like = 0 (dislikes = 0, pas de vote)
    if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        console.log("userId est dans usersDisliked et requête front dislike égale à 0");
    

    // mise à jour sauce BDD
    Sauce.updateOne(
        {_id: req.params.id},
        {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: req.body.userId}
        }
        )
        .then(() => res.status(201).json({message: 'sauce dislike 0'}))
        .catch((error) => res.status(400).json({error}));

    }

    })
    .catch((error) => res.status(404).json({error}));
}
