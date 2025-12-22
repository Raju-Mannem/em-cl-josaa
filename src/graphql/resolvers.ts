import { Context } from "../pages/api/graphql";

const resolvers = {
  Query: {
    josaa2025ByRank: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { minOpeningRank, maxclosingRank, rounds, academicProgramName, quota, seatType, gender, type } =
        args.filter;

      const whereClause: any = {
        round: { in: rounds },
        academicProgramName: { in: academicProgramName },
        quota: {in: quota},
        seatType: { in: seatType },
        gender: { in: gender },
        type: {in: type}
      };

      const rows = await context.prisma.josaa2025.findMany({
        where: whereClause,
        orderBy: {
          priority: "asc",
        },
      });

      // 1. Filter rows by minOpeningRank and maxClosingRank
      const filteredRows = rows.filter((row: any) => {
        const openingRankStr = row.openingRank || "";
        const closingRankStr = row.closingRank || "";
        const openingRank = parseInt(openingRankStr.replace('p', ''), 10);
        const closingRank = parseInt(closingRankStr.replace('p', ''), 10);
        return openingRank >= minOpeningRank && closingRank <= maxclosingRank;
      });

      // 2. Group rows by sno, institute, academicProgramName, quota, seatType, gender, and priority
      const groupedRows = filteredRows.reduce((acc: any, row: any) => {
        const key = `${row.institute}-${row.academicProgramName}-${row.quota}-${row.seatType}-${row.gender}`;
        
        if (!acc[key]) {
          acc[key] = {
            sno: row.sno,
            institute: row.institute,
            academicProgramName: row.academicProgramName,
            quota: row.quota,
            seatType: row.seatType,
            gender: row.gender,
            openingRank: row.openingRank,
            closingRank: row.closingRank,
            priority: row.priority,
            rounds: [],
            type: row.type,
            nirf: row.nirf,
          };
        }

        acc[key].rounds.push(row.round);

        return acc;
      }, {});

      // Convert grouped data back to array
      let result = Object.values(groupedRows);

      // 3. Separate rows that contain 'p' in openingRank or closingRank
      const rowsWithP = result.filter((row: any) => 
        row.openingRank.includes('p') || row.closingRank.includes('p')
      );

      const rowsWithoutP = result.filter((row: any) => 
        !row.openingRank.includes('p') && !row.closingRank.includes('p')
      );

      // Sort the result by academicProgramName according to the input order
      result = [...rowsWithoutP, ...rowsWithP]; // Keep rows with 'p' at the end
      // // Sorting based on the order of `academicProgramName` from the filter
      // result.sort((a: any, b: any) => {
      //   const indexA = academicProgramName.indexOf(a.academicProgramName);
      //   const indexB = academicProgramName.indexOf(b.academicProgramName);
      //   return indexA - indexB;
      // });

      // Return final sorted result
      return result;
    },
  },
};

export default resolvers;
