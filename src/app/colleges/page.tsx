import { instituteOptions } from "@/data/institute";
import { programOptions } from "@/data/programs";

const Colleges = () => {
  return (
    <section className="flex flex-col gap-12 justify-center items-center h-full w-full overflow-x-auto py-8 sm:py-12 sm:px-8">
      <div>
        <strong className="bg-emerald-800/60 text-white px-4 py-2 mb-4">2025 Institutions</strong>
        <table className="w-max table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
          <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
            <tr>
              <th className="border border-gray-300 text-center p-2">SNO</th>
              <th className="border border-gray-300 text-center p-2">
                Institute Name
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {instituteOptions.map((ins, index) => (
              <tr
                key={index++}
                className={`hover:bg-stone-50 hover:text-blue-500 h-4 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-stone-50"
                }`}
              >
                <td className="border border-gray-300 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  {ins.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <strong className="bg-emerald-800/60 text-white px-4 py-2 mb-4">2025 Programs</strong>
        <table className="w-max table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
          <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
            <tr>
              <th className="border border-gray-300 text-center p-2">SNO</th>
              <th className="border border-gray-300 text-center p-2">
                Program Name
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {programOptions.map((pr, index) => (
              <tr
                key={index++}
                className={`hover:bg-stone-50 hover:text-blue-500 h-4 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-stone-50"
                }`}
              >
                <td className="border border-gray-300 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  {pr.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Colleges;