import { gql } from "@apollo/client";

export const GET_JOSAA_2025 = gql`
  query Josaa2025($filter: RankFilterInput!) {
    josaa2025ByRank(filter: $filter) {
        sno
        institute
        academicProgramName
        quota
        seatType
        gender
        openingRank
        closingRank
        priority
        rounds
    }
  }
`;