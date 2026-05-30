"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { GET_JOSAA_2025 } from "../graphql/queries";
import { instituteOptions } from "../data/institute";
import { programOptions } from "../data/programs";
import { seatOptions } from "../data/seat";
import { quotaOptions } from "../data/quota";
import { roundOptions } from "../data/rounds";
import { genderOptions } from "../data/gender";
import { typeOptions } from "../data/type";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "sonner";
import SearchableMultiSelect from "./SearchableMultiSelect";

// interface josaaCutoff2025sPdfData {
//   sno: number;
//   institute: string;
//   academicProgramName: string;
// }

interface josaa2025ByRankQueryResult {
  josaa2025ByRank: CutoffRow[];
}

export interface CutoffRow {
  sno: number;
  institute: string;
  academicProgramName: string;
  quota: string;
  seatType: string;
  gender: string;
  openingRank: string;
  closingRank: string;
  priority: string;
  rounds: Array<number>;
  type: string;
  nirf: number;
}

type ColumnKey = keyof CutoffRow | "sno";

type TableRow = Partial<Record<ColumnKey, string | number>>;

const Cutoff2024 = () => {
  const [minOpeningRank, setMinOpeningRank] = useState("");
  const [maxClosingRank, setMaxClosingRank] = useState("");
  const [selectedSeatType, setSelectedSeatType] = useState<string[]>([]);
  const [selectedQuota, setSelectedQuota] = useState<string[]>([]);
  const [selectedInstituteOption, setSelectedInstituteOption] = useState<
    string[]
  >([]);
  const [selectedAacademedicProgram, setSelectedAacademedicProgram] = useState<
    string[]
  >([]);
  const [selectedRounds, setSelectedRounds] = useState<number[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const [stdName, setStdName] = useState<string>("");
  const [stdRank, setStdRank] = useState<string>("");
  const [stdCaste, setStdCaste] = useState<string>("");
  const [result, setResult] = useState<CutoffRow[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<ColumnKey[]>([
    "sno",
    "type",
    "institute",
    "academicProgramName",
  ]);

  const allColumns: { label: string; value: ColumnKey }[] = [
    { label: "S.NO", value: "sno" },
    { label: "Type", value: "type" },
    { label: "Institute", value: "institute" },
    { label: "Academic Program", value: "academicProgramName" },
    { label: "Quota", value: "quota" },
    { label: "Seat Type", value: "seatType" },
    { label: "Gender", value: "gender" },
    { label: "Opening Rank", value: "openingRank" },
    { label: "Closing Rank", value: "closingRank" },
    { label: "Priority", value: "priority" },
    { label: "NIRF", value: "nirf" },
    { label: "Rounds", value: "rounds" },
  ];

  const [fetchCutoffs, { data, loading, error }] =
    useLazyQuery<josaa2025ByRankQueryResult>(GET_JOSAA_2025, {
      errorPolicy: "all",
    });

  const handlePDF = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column");
      return;
    }

    if (!stdName) {
      toast.error("invalid details");
    } else {
      const doc = new jsPDF();
      /** 
	const imgURL = "/EAMCET INSTRUCTIONS_page-0001.jpg";
    doc.addImage(imgURL, "PNG", 5, 10, 200, 250);  
    
    doc.addPage("p");
    **/

      // doc.text(
      //   `Name: ${stdName} | Rank: ${stdRank} | Caste: ${stdCaste}`,
      //   14,
      //   16
      // );

      const tableData: TableRow[] = result.map((row, index) => {
        const newRow: TableRow = {};

        selectedColumns.forEach((col) => {
          if (col === "sno") {
            newRow[col] = index + 1;
          } else if (col === "rounds") {
            newRow[col] = row.rounds.join(", ");
          } else {
            newRow[col] = row[col];
          }
        });

        return newRow;
      });

      const firstTableColumn = [
        `Name: ${stdName} `,
        `Rank: ${stdRank} `,
        `Caste: ${stdCaste} `,
      ];

      const tableColumn: { header: string; dataKey: ColumnKey }[] = allColumns
        .filter((col) => selectedColumns.includes(col.value))
        .map((col) => ({
          header: col.label,
          dataKey: col.value,
        }));

      autoTable(doc, {
        head: [firstTableColumn],
        startY: 14,
        margin: { top: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          font: "helvetica",
          // textColor: [40, 40, 40],
          // lineColor: [44, 62, 80],
          // lineWidth: 0.2,
          valign: "middle",
          halign: "center",
        },
        headStyles: {
          fillColor: [236, 250, 229], // light green header background
          textColor: [16, 46, 80], // Navy blue header text
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center", fontStyle: "bold" }, // first column centered and bold
          1: { halign: "center" },
        },
        theme: "plain", //'plain' to avoid built-in styling interference
      });

      autoTable(doc, {
        columns: tableColumn,
        body: tableData,
        startY: 34,
        margin: { top: 10, bottom: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 2,
          minCellHeight: 14,
          valign: "middle",
        },
        columnStyles: {
          0: { halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
          2: { cellWidth: "auto", halign: "left" },
        },
        theme: "grid",
      });

      doc.save(`${stdName}-${stdRank}-${stdCaste}.pdf`);
      toast.success(`pdf downloaded successfully`);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Number(minOpeningRank) >= Number(maxClosingRank) ||
      Number(minOpeningRank) < 0 ||
      selectedSeatType.length < 1 ||
      selectedAacademedicProgram.length < 1 ||
      selectedRounds.length < 1 ||
      selectedGender.length < 1
    ) {
      toast.error(`Invalid details, Please check details`);
    } else {
      const variables = {
        filter: {
          minOpeningRank: Number(minOpeningRank),
          maxclosingRank: Number(maxClosingRank),
          rounds: selectedRounds,
          academicProgramName: selectedAacademedicProgram,
          quota: selectedQuota,
          seatType: selectedSeatType,
          gender: selectedGender,
          type: selectedType,
          institutes: selectedInstituteOption,
        },
      };
      console.log(variables);
      // console.log("Submitting filter:", variables);
      fetchCutoffs({ variables });
    }
  };

  useEffect(() => {
    if (data?.josaa2025ByRank) {
      setResult(data.josaa2025ByRank);
    }
  }, [data]);

  const handleDelete = (sno: number) => {
    setResult((prevItems) => prevItems.filter((item) => item.sno !== sno));
  };

  return (
    <section className="flex justify-center items-center flex-col overflow-x-auto py-2 sm:py-4 sm:px-8 text-[6px] sm:text-[12px] font-sans">
      <article className="w-full h-full">
        <form
          className="flex justify-start flex-wrap items-start gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-2 flex-wrap">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Minimum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="minimum rank"
                value={minOpeningRank}
                onChange={(e) => setMinOpeningRank(e.target.value)}
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Maximum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="maximum rank"
                value={maxClosingRank}
                onChange={(e) => setMaxClosingRank(e.target.value)}
                required
                min={0}
              />
            </div>
          <SearchableMultiSelect
            title="Institute"
            options={instituteOptions}
            selectedValues={selectedInstituteOption}
            setSelectedValues={setSelectedInstituteOption}
          />
          <SearchableMultiSelect
            title="Academic Program"
            options={programOptions}
            selectedValues={selectedAacademedicProgram}
            setSelectedValues={setSelectedAacademedicProgram}
          />
          <SearchableMultiSelect
            title="Quota"
            options={quotaOptions}
            selectedValues={selectedQuota}
            setSelectedValues={setSelectedQuota}
          />
          <SearchableMultiSelect
            title="Seat Type"
            options={seatOptions}
            selectedValues={selectedSeatType}
            setSelectedValues={setSelectedSeatType}
          />
          <SearchableMultiSelect
            title="Gender"
            options={genderOptions}
            selectedValues={selectedGender}
            setSelectedValues={setSelectedGender}
          />
          <SearchableMultiSelect
            title="Type"
            options={typeOptions}
            selectedValues={selectedType}
            setSelectedValues={setSelectedType}
          />
          <SearchableMultiSelect
            title="Rounds"
            options={roundOptions}
            selectedValues={selectedRounds}
            setSelectedValues={setSelectedRounds}
          />
          </div>
          <button
            type="submit"
            className="justify-self-end basis-1/12 sm:ml-4 mt-2 sm:mt-6 bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            search
          </button>
        </form>
      </article>
      <article className="w-full h-full mt-20">
        <div className="mt-8 flex gap-4 flex-wrap items-start">
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Name
            </label>
            <input
              type="text"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="student name"
              value={stdName}
              onChange={(e) => setStdName(e.target.value)}
              required
              min={0}
            />
          </span>
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Rank
            </label>
            <input
              type="number"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="rank"
              value={stdRank}
              onChange={(e) => setStdRank(e.target.value)}
              required
            />
          </span>
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Caste
            </label>
            <input
              type="text"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="caste"
              value={stdCaste}
              onChange={(e) => setStdCaste(e.target.value)}
              required
              min={0}
            />
          </span>
          <span>
            <button
              type="submit"
              className="justify-self-end basis-1/12 sm:ml-4 mt-2 sm:mt-6 bg-emerald-700 px-4 py-2 font-semibold text-white rounded hover:bg-indigo-700 transition"
              onClick={() => handlePDF()}
            >
              print
            </button>
          </span>
        </div>
        <div className="mt-4 bg-indigo-100 border-1 border-indigo-200 p-4 rounded-lg">
          <p className="font-semibold mb-2">Select Columns for PDF</p>

          <div className="flex flex-wrap gap-3">
            {allColumns.map((col) => (
              <label key={col.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setSelectedColumns((prev) =>
                      checked
                        ? [...prev, col.value]
                        : prev.filter((c) => c !== col.value),
                    );
                  }}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-8">
          {loading && (
            <div className="flex justify-center align-center gap-2 text-indigo-500 text-center">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 w-16 h-16 animate-spin"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </span>
              <span>
                <strong className="text-2xl font-sans">
                  {" "}
                  Loading............
                </strong>
              </span>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">
              Error: {error.message}
              {/* {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))} */}
              {JSON.stringify(error)}
            </div>
          )}
          {/* {rowsLoading && (
            <div className="text-indigo-500 flex justify-center items-center">Loading Rows...</div>
          )} */}
          {/* {rowsError && (
            <div className="text-red-500 text-center">
              Error: {rowsError.message}
            </div>
          )} */}
          {/* {JSON.stringify(data)} */}
          {data?.josaa2025ByRank?.length === 0 && (
            <div className="text-red-500 text-center py-12 border-t text-sm">
              No rows found for the selected institute codes.
            </div>
          )}
          {result?.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
                <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
                  <tr className="">
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Sno
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      Type
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      Institute
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      Academic Program
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Quota
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Seat Type
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Gender
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Opening Rank
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Closing Rank
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Priority
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      NIRF
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Rounds
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-900">
                  {result.map((row: CutoffRow, index: number) => (
                    <tr
                      key={row.sno}
                      className={`hover:bg-stone-50 
                          hover:text-blue-500 h-4 ${
                            index % 2 != 0 ? "bg-gray-100" : ""
                          }`}
                    >
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        <button
                          className="flex justify-center items-center gap-1 w-full h-full"
                          onClick={() => handleDelete(row.sno)}
                        >
                          {index + 1}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-1 sm:size-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="border border-gray-300 pl-2 py-2">
                        {row.type}
                      </td>
                      <td className="border border-gray-300 pl-2 py-2">
                        {row.institute}
                      </td>
                      <td className="border border-gray-300 pl-2 py-2">
                        {row.academicProgramName}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.quota}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.seatType}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.gender}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.openingRank}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.closingRank}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.priority}
                      </td>
                      <td className="border border-gray-300 pl-2 py-2">
                        {row.nirf}
                      </td>
                      <td className="border border-gray-300 py-2 text-center max-w-min">
                        {row.rounds.map((value, index) => (
                          <span
                            className="px-[6px] py-[2px] bg-blue-400 rounded-full mr-[2px]"
                            key={index}
                          >
                            {value}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 border-t-2 border-indigo-200-200 text-gray-500 text-center text-[24px]">
              Enter details
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default Cutoff2024;
