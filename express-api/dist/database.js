"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRecipes = exports.deleteRecipe = exports.setRecipe = exports.setUser = exports.getUser = exports.firestore = void 0;
const firebase_admin_1 = require("firebase-admin");
const service = require("./service/boiler-plate-app.json");
exports.firestore = firebase_admin_1.initializeApp({
    credential: firebase_admin_1.credential.cert(service)
}).firestore();
const getUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const document = exports.firestore.doc(`users/${email.toLowerCase()}`);
    const snapshot = yield document.get();
    const user = snapshot.data();
    return user || null;
});
exports.getUser = getUser;
const setUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const document = exports.firestore.doc(`users/${user.email.toLowerCase()}`);
    yield document.set(user, { merge: true });
    const snapshot = yield document.get();
    const update = snapshot.data();
    return update;
});
exports.setUser = setUser;
const setRecipe = (recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const document = exports.firestore.doc(`recipes/${recipe.cid}`);
    const firestoreDatabase = yield document.get();
    const recipeFirestore = firestoreDatabase.data();
    if (recipeFirestore && recipeFirestore.creator !== recipe.creator)
        return null;
    yield document.set(recipe);
    const snapshot = yield document.get();
    const update = snapshot.data();
    return update;
});
exports.setRecipe = setRecipe;
const deleteRecipe = (recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const document = exports.firestore.doc(`recipes/${recipe.cid}`);
    const snapshot = yield document.get();
    const found = snapshot.data();
    if (!found || found.creator !== recipe.creator)
        return null;
    yield document.set(recipe);
    return null;
});
exports.deleteRecipe = deleteRecipe;
const findRecipes = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const query = Object.keys(filter).reduce((query, key) => query.where(key, '==', filter[key]), exports.firestore.collection('recipes'));
    const snapshot = yield query.get();
    snapshot.forEach((doc) => {
        const session = doc.data();
        if (!session.deleted) {
            results.push(Object.assign(Object.assign({}, session), { created: session.created }));
        }
    });
    return results;
});
exports.findRecipes = findRecipes;
//# sourceMappingURL=database.js.map