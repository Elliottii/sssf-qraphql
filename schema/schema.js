"use strict";
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

const animal = require('../models/animal');
const species = require('../models/species');
const category = require('../models/category');

const animalType = new GraphQLObjectType({
    name: 'animal',
    description: 'Animal name and species',
    fields: () => ({
        id: {type: GraphQLID},
        animalName: {type: GraphQLString},
        species: {
            type: speciesType,
            resolve(parent, args) {
                return species.findById(parent.species);
            },
        },
    }),
});

const speciesType = new GraphQLObjectType({
    name: 'species',
    description: 'Animal species',
    fields: () => ({
        speciesName: {type: GraphQLString},
        category: {
            id: {type: GraphQLID},
            type: categoryType,
            resolve(parent, args) {
                return category.findById(parent.category);
            },
        },
    }),
});

const categoryType = new GraphQLObjectType({
    name: 'gategory',
    description: 'Animal gategory',
    fields: () => ({
        id: {type: GraphQLID},
        categoryName: {type: GraphQLString},
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Main query',
    fields: {
        animals: {
            type: new GraphQLList(animalType),
            description: 'Get all animals',
            resolve(parent, args) {
                return animal.find();
            }
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutations...',
    fields: () => ({
        addCategory: {
            type: categoryType,
            description: 'Add animal category like Fish, Mammal, etc.',
            args: {
                categoryName: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                const newCategory = new category({
                    categoryName: args.categoryName,
                });
                return newCategory.save();
            },
        },
        addSpecies: {
            type: speciesType,
            description: 'Add animal species like Dog, Cat, etc.',
            args: {
                speciesName: {type: new GraphQLNonNull(GraphQLString)},
                category: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                const newSpecies = new species({
                    speciesName: args.speciesName,
                    category: args.category,
                });
                return newSpecies.save();
            },
        },
        addAnimal: {
            type: animalType,
            description: 'Add animal',
            args: {
                animalName: {type: new GraphQLNonNull(GraphQLString)},
                species: {type: GraphQLID},
            },
            resolve(parent, args) {
                const newAnimal = new animal({
                    animalName: args.animalName,
                    species: args.species,
                });
                return newAnimal.save();
            },
        },
    }),
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
