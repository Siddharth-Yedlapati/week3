//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;
const expect = chai.expect;

describe("MasterMind Test", function () {
    this.timeout(100000000);

    it("Correct inputs; should pass", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const INPUT = {
            pubGuessA: 3,
            pubGuessB: 1,
            pubGuessC: 2,
            pubGuessD: 4,
            pubNumHit: 4,
            pubNumBlow: 0,
            pubSolnHash: 18062088613804664315496858850984723054728976780726547245238730046236115546326,
            privSolnA: 3,
            privSolnB: 1,
            privSolnC: 2,
            privSolnD: 4,
            privSalt: 10**223
        }

        const witness = await circuit.calculateWitness(INPUT, true);


        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(18062088613804664315496858850984723054728976780726547245238730046236115546326)));
    });

    it("numbers outside range, Should fail.", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();


        const INPUT = {
            pubGuessA: 0,
            pubGuessB: 1,
            pubGuessC: 2,
            pubGuessD: 7,
            pubNumHit: 4,
            pubNumBlow: 0,
            pubSolnHash: 14823043732474042504531112261804514776884225955956927441298273371186096601977,
            privSalt: 10**223,
            privSolnA: 0,
            privSolnB: 1,
            privSolnC: 2,
            privSolnD: 5
        }

        await expect(circuit.calculateWitness(INPUT, true)).to.Throw;
    });

    it("incorrect guess, Should fail.", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const INPUT = {
            pubGuessA: 0,
            pubGuessB: 4,
            pubGuessC: 5,
            pubGuessD: 3,
            pubNumHit: 4,
            pubNumBlow: 0,
            pubSolnHash: 14823043732474042504531112261804514776884225955956927441298273371186096601977,
            privSalt: 10**223,
            privSolnA: 3,
            privSolnB: 1,
            privSolnC: 2,
            privSolnD: 4
        }

        await expect(circuit.calculateWitness(INPUT, true)).to.Throw;
    });

});