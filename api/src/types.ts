import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { parseJSON } from 'date-fns';

export type User = {
  email: string;
  name: string;
  groups: string[];
  password: string | null;
  google: string | null;
  picture: string | null;
  created: Date;
};

export type Recipe = {
  id: string;
  cid: string;
  name: string | null;
  duration: string | null;
  creator: string;
  difficulty: number;
  image: string;
  text: string;
  created: Date;
};

export const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  serialize: (value: Date) => new Date(value),
  parseValue: (value: string) => parseJSON(value),
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) return null;

    return parseJSON(`${ast}`);
  }
});

export const GraphQLAny = new GraphQLScalarType({
  name: 'Any',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => ast
});
