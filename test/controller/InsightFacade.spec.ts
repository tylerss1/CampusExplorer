import {
	IInsightFacade,
	InsightDatasetKind,
	InsightError,
	InsightResult,
	ResultTooLargeError,
} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";

import {folderTest} from "@ubccpsc310/folder-test";
import {assert, expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import {clearDisk, getContentFromArchives} from "../TestUtil";
import SectionHandler from "../../src/controller/DatasetProcessor/SectionHandler";
import DiskHandler from "../../src/controller/DatasetProcessor/DiskHandler";
import Section from "../../src/model/Section";

use(chaiAsPromised);

describe("InsightFacade", function () {
	let facade: IInsightFacade;

	// Declare datasets used in tests. You should add more datasets like this!
	let sections: string;

	before(function () {
		// This block runs once and loads the datasets.
		sections = getContentFromArchives("pair.zip");

		// Just in case there is anything hanging around from a previous run of the test suite
		clearDisk();
	});

	describe("Add/Remove/List Dataset", function () {
		before(function () {
			console.info(`Before: ${this.test?.parent?.title}`);
		});

		beforeEach(function () {
			// This section resets the insightFacade instance
			// This runs before each test
			console.info(`BeforeTest: ${this.currentTest?.title}`);
			facade = new InsightFacade();
		});

		after(function () {
			console.info(`After: ${this.test?.parent?.title}`);
		});

		afterEach(function () {
			// This section resets the data directory (removing any cached data)
			// This runs after each test, which should make each test independent of the previous one
			console.info(`AfterTest: ${this.currentTest?.title}`);
			clearDisk();
		});

		// This is a unit test. You should create more like this!
		it("should reject with  an empty dataset id", function () {
			const result = facade.addDataset("", sections, InsightDatasetKind.Sections);
			return expect(result).to.eventually.be.rejectedWith(InsightError);
		});
	});

	/*
	 * This test suite dynamically generates tests from the JSON files in test/resources/queries.
	 * You should not need to modify it; instead, add additional files to the queries directory.
	 * You can still make tests the normal way, this is just a convenient tool for a majority of queries.
	 */
	describe("PerformQuery", () => {
		before(function () {
			console.info(`Before: ${this.test?.parent?.title}`);

			facade = new InsightFacade();
			sections = getContentFromArchives("test2.zip");

			// Load the datasets specified in datasetsToQuery and add them to InsightFacade.
			// Will *fail* if there is a problem reading ANY dataset.
			const loadDatasetPromises = [facade.addDataset("sections", sections, InsightDatasetKind.Sections)];

			return Promise.all(loadDatasetPromises);
		});

		after(function () {
			console.info(`After: ${this.test?.parent?.title}`);
			clearDisk();
		});

		type PQErrorKind = "ResultTooLargeError" | "InsightError";

		folderTest<unknown, Promise<InsightResult[]>, PQErrorKind>(
			"Dynamic InsightFacade PerformQuery tests",
			(input) => facade.performQuery(input),
			"./test/resources/queries",
			{
				assertOnResult: (actual, expected) => {
					// TODO add an assertion!
					expect(actual).to.equal(expected);
				},
				errorValidator: (error): error is PQErrorKind =>
					error === "ResultTooLargeError" || error === "InsightError",
				assertOnError: (actual, expected) => {
					// TODO add an assertion!
					if (expected === "ResultTooLargeError") {
						expect(actual).to.be.instanceOf(ResultTooLargeError);
					} else if (expected === "InsightError") {
						expect(actual).to.be.instanceOf(InsightError);
					}
				},
			}
		);
	});
});

describe("Dataset testing", function () {
	it("should be false", function () {
		let datasethandler = new SectionHandler();
		assert.strictEqual(datasethandler.validateID("_"), false);
	});

	it("retrieve disk test", function () {
		let diskHandler = new DiskHandler();
		let datamap = new Map<string, Section[]>();
		datamap = diskHandler.retrieveDisk();
	});

	it("save section test", function () {
		const content = getContentFromArchives("test.zip");
		let diskHandler = new DiskHandler();
		diskHandler.saveSection("testing", content);
	});

	it("load section data test", function () {
		let sectionHandler = new SectionHandler();
		let sections = sectionHandler.loadSectionData("./data/testing.json");
	});

	it("load section into memory test", function () {
		const content = getContentFromArchives("test2.zip");
		let sectionHandler = new SectionHandler();
		let sectionMap = sectionHandler.loadSectionToMemory("loadTest", content);
	});

	it("should add successfully", function () {
		const content = getContentFromArchives("test.zip");
		let insightfacade = new InsightFacade();
		insightfacade.addDataset("test", content, InsightDatasetKind.Sections);
	});

	it("should remove successfully", function () {
		const content = getContentFromArchives("test.zip");
		let insightfacade = new InsightFacade();
		insightfacade.removeDataset("test");
	});

	it("test", function () {
		const content = getContentFromArchives("test.zip");
		let insightfacade = new InsightFacade();
		insightfacade.addDataset("fff", content, InsightDatasetKind.Rooms);
	});

	it("testwsws", function () {
		const content = getContentFromArchives("test.zip");
		let insightfacade = new InsightFacade();
		insightfacade.addDataset("sfdgf", content, InsightDatasetKind.Rooms);
	});
});
