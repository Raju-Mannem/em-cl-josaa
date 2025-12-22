const typeDefs = `#graphql

    type Josaa2025 {
        sno: ID!
        round: Int
        institute: String
        academicProgramName: String
        quota: String
        seatType: String
        gender: String
        openingRank: String
        closingRank: String
        priority: Int
        nirf: Int
        type: String
    }

    input RankFilterInput {
        minOpeningRank: Int!
        # maxOpeningRank: Int!
        # minclosingRank: Int!
        maxclosingRank: Int!
        rounds: [Int!]!
        academicProgramName: [String!]!
        quota: [String!]!
        seatType: [String!]!
        gender: [String!]
        type: [String!]
    }

    type Josaa2025Res {
        sno: ID!
        rounds: [Int!]
        institute: String
        academicProgramName: String
        quota: String
        seatType: String
        gender: String
        openingRank: String
        closingRank: String
        priority: Int
        nirf: Int
        type: String
  }
    scalar JSON
    
    type Query {
        josaa2025ByRank(filter: RankFilterInput!): [Josaa2025Res!]!
    }
    
`;
export default typeDefs;
