import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** The Any scalar type is used in operations and types that involve any type of value. */
  Any: any;
  /** The Object scalar type is used in operations and types that involve objects. */
  Object: any;
  /** The Date scalar type is used in operations and types that involve dates. */
  Date: any;
  /** The Bytes scalar type is used in operations and types that involve base 64 binary data. */
  Bytes: any;
  /** The File scalar type is used in operations and types that involve files. */
  File: any;
};



/** Query is the top level type for queries. */
export type Query = {
  __typename?: 'Query';
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** The role query can be used to get an object of the Role class by its id. */
  role: Role;
  /** The roles query can be used to find objects of the Role class. */
  roles: RoleConnection;
  /** The session query can be used to get an object of the Session class by its id. */
  session: Session;
  /** The sessions query can be used to find objects of the Session class. */
  sessions: SessionConnection;
  /** The user query can be used to get an object of the User class by its id. */
  user: User;
  /** The users query can be used to find objects of the User class. */
  users: UserConnection;
  /** The campaign query can be used to get an object of the Campaign class by its id. */
  campaign: Campaign;
  /** The campaigns query can be used to find objects of the Campaign class. */
  campaigns: CampaignConnection;
  /** The deck query can be used to get an object of the Deck class by its id. */
  deck: Deck;
  /** The decks query can be used to find objects of the Deck class. */
  decks: DeckConnection;
  /** The guide query can be used to get an object of the Guide class by its id. */
  guide: Guide;
  /** The guides query can be used to find objects of the Guide class. */
  guides: GuideConnection;
  /** The publicUser query can be used to get an object of the PublicUser class by its id. */
  publicUser: PublicUser;
  /** The publicUsers query can be used to find objects of the PublicUser class. */
  publicUsers: PublicUserConnection;
  /** The userFriends query can be used to get an object of the UserFriends class by its id. */
  userFriends: UserFriends;
  /** The userProfile query can be used to get an object of the UserProfile class by its id. */
  userProfile: UserProfile;
  /** The userProfiles query can be used to find objects of the UserProfile class. */
  userProfiles: UserProfileConnection;
  /** The weaknessSet query can be used to get an object of the WeaknessSet class by its id. */
  weaknessSet: WeaknessSet;
  /** The weaknessSets query can be used to find objects of the WeaknessSet class. */
  weaknessSets: WeaknessSetConnection;
  /** The health query can be used to check if the server is up and running. */
  health: Scalars['Boolean'];
  /** The viewer query can be used to return the current user data. */
  viewer: Viewer;
  /** The class query can be used to retrieve an existing object class. */
  class: Class;
  /** The classes query can be used to retrieve the existing object classes. */
  classes: Array<Class>;
  currentUserHandle: PublicUser;
};


/** Query is the top level type for queries. */
export type QueryNodeArgs = {
  id: Scalars['ID'];
};


/** Query is the top level type for queries. */
export type QueryRoleArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryRolesArgs = {
  where?: Maybe<RoleWhereInput>;
  order?: Maybe<Array<RoleOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QuerySessionArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QuerySessionsArgs = {
  where?: Maybe<SessionWhereInput>;
  order?: Maybe<Array<SessionOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryUserArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryUsersArgs = {
  where?: Maybe<UserWhereInput>;
  order?: Maybe<Array<UserOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryCampaignArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryCampaignsArgs = {
  where?: Maybe<CampaignWhereInput>;
  order?: Maybe<Array<CampaignOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryDeckArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryDecksArgs = {
  where?: Maybe<DeckWhereInput>;
  order?: Maybe<Array<DeckOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryGuideArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryGuidesArgs = {
  where?: Maybe<GuideWhereInput>;
  order?: Maybe<Array<GuideOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryPublicUserArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryPublicUsersArgs = {
  where?: Maybe<PublicUserWhereInput>;
  order?: Maybe<Array<PublicUserOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryUserFriendsArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryUserProfileArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryUserProfilesArgs = {
  where?: Maybe<UserProfileWhereInput>;
  order?: Maybe<Array<UserProfileOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryWeaknessSetArgs = {
  id: Scalars['ID'];
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryWeaknessSetsArgs = {
  where?: Maybe<WeaknessSetWhereInput>;
  order?: Maybe<Array<WeaknessSetOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** Query is the top level type for queries. */
export type QueryClassArgs = {
  name: Scalars['String'];
};

/** Mutation is the top level type for mutations. */
export type Mutation = {
  __typename?: 'Mutation';
  /** The createRole mutation can be used to create a new object of the Role class. */
  createRole?: Maybe<CreateRolePayload>;
  /** The updateRole mutation can be used to update an object of the Role class. */
  updateRole?: Maybe<UpdateRolePayload>;
  /** The deleteRole mutation can be used to delete an object of the Role class. */
  deleteRole?: Maybe<DeleteRolePayload>;
  /** The createSession mutation can be used to create a new object of the Session class. */
  createSession?: Maybe<CreateSessionPayload>;
  /** The updateSession mutation can be used to update an object of the Session class. */
  updateSession?: Maybe<UpdateSessionPayload>;
  /** The deleteSession mutation can be used to delete an object of the Session class. */
  deleteSession?: Maybe<DeleteSessionPayload>;
  /** The createUser mutation can be used to create a new object of the User class. */
  createUser?: Maybe<CreateUserPayload>;
  /** The updateUser mutation can be used to update an object of the User class. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** The deleteUser mutation can be used to delete an object of the User class. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** The createCampaign mutation can be used to create a new object of the Campaign class. */
  createCampaign?: Maybe<CreateCampaignPayload>;
  /** The updateCampaign mutation can be used to update an object of the Campaign class. */
  updateCampaign?: Maybe<UpdateCampaignPayload>;
  /** The deleteCampaign mutation can be used to delete an object of the Campaign class. */
  deleteCampaign?: Maybe<DeleteCampaignPayload>;
  /** The createDeck mutation can be used to create a new object of the Deck class. */
  createDeck?: Maybe<CreateDeckPayload>;
  /** The updateDeck mutation can be used to update an object of the Deck class. */
  updateDeck?: Maybe<UpdateDeckPayload>;
  /** The deleteDeck mutation can be used to delete an object of the Deck class. */
  deleteDeck?: Maybe<DeleteDeckPayload>;
  /** The createGuide mutation can be used to create a new object of the Guide class. */
  createGuide?: Maybe<CreateGuidePayload>;
  /** The updateGuide mutation can be used to update an object of the Guide class. */
  updateGuide?: Maybe<UpdateGuidePayload>;
  /** The deleteGuide mutation can be used to delete an object of the Guide class. */
  deleteGuide?: Maybe<DeleteGuidePayload>;
  /** The createPublicUser mutation can be used to create a new object of the PublicUser class. */
  createPublicUser?: Maybe<CreatePublicUserPayload>;
  /** The updatePublicUser mutation can be used to update an object of the PublicUser class. */
  updatePublicUser?: Maybe<UpdatePublicUserPayload>;
  /** The deletePublicUser mutation can be used to delete an object of the PublicUser class. */
  deletePublicUser?: Maybe<DeletePublicUserPayload>;
  /** The createUserFriends mutation can be used to create a new object of the UserFriends class. */
  createUserFriends?: Maybe<CreateUserFriendsPayload>;
  /** The updateUserFriends mutation can be used to update an object of the UserFriends class. */
  updateUserFriends?: Maybe<UpdateUserFriendsPayload>;
  /** The deleteUserFriends mutation can be used to delete an object of the UserFriends class. */
  deleteUserFriends?: Maybe<DeleteUserFriendsPayload>;
  /** The createUserProfile mutation can be used to create a new object of the UserProfile class. */
  createUserProfile?: Maybe<CreateUserProfilePayload>;
  /** The updateUserProfile mutation can be used to update an object of the UserProfile class. */
  updateUserProfile?: Maybe<UpdateUserProfilePayload>;
  /** The deleteUserProfile mutation can be used to delete an object of the UserProfile class. */
  deleteUserProfile?: Maybe<DeleteUserProfilePayload>;
  /** The createWeaknessSet mutation can be used to create a new object of the WeaknessSet class. */
  createWeaknessSet?: Maybe<CreateWeaknessSetPayload>;
  /** The updateWeaknessSet mutation can be used to update an object of the WeaknessSet class. */
  updateWeaknessSet?: Maybe<UpdateWeaknessSetPayload>;
  /** The deleteWeaknessSet mutation can be used to delete an object of the WeaknessSet class. */
  deleteWeaknessSet?: Maybe<DeleteWeaknessSetPayload>;
  /** The createFile mutation can be used to create and upload a new file. */
  createFile?: Maybe<CreateFilePayload>;
  /** The signUp mutation can be used to create and sign up a new user. */
  signUp?: Maybe<SignUpPayload>;
  /** The logInWith mutation can be used to signup, login user with 3rd party authentication system. This mutation create a user if the authData do not correspond to an existing one. */
  logInWith?: Maybe<LogInWithPayload>;
  /** The logIn mutation can be used to log in an existing user. */
  logIn?: Maybe<LogInPayload>;
  /** The logOut mutation can be used to log out an existing user. */
  logOut?: Maybe<LogOutPayload>;
  /** The resetPassword mutation can be used to reset the password of an existing user. */
  resetPassword?: Maybe<ResetPasswordPayload>;
  /** The sendVerificationEmail mutation can be used to send the verification email again. */
  sendVerificationEmail?: Maybe<SendVerificationEmailPayload>;
  /** The challenge mutation can be used to initiate an authentication challenge when an auth adapter need it. */
  challenge?: Maybe<ChallengePayload>;
  /** The callCloudCode mutation can be used to invoke a cloud code function. */
  callCloudCode?: Maybe<CallCloudCodePayload>;
  /** The createClass mutation can be used to create the schema for a new object class. */
  createClass?: Maybe<CreateClassPayload>;
  /** The updateClass mutation can be used to update the schema for an existing object class. */
  updateClass?: Maybe<UpdateClassPayload>;
  /** The deleteClass mutation can be used to delete an existing object class. */
  deleteClass?: Maybe<DeleteClassPayload>;
  updateHandle: PublicUser;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteRoleArgs = {
  input: DeleteRoleInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateSessionArgs = {
  input: CreateSessionInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateSessionArgs = {
  input: UpdateSessionInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteSessionArgs = {
  input: DeleteSessionInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateCampaignArgs = {
  input: CreateCampaignInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateCampaignArgs = {
  input: UpdateCampaignInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteCampaignArgs = {
  input: DeleteCampaignInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateDeckArgs = {
  input: CreateDeckInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateDeckArgs = {
  input: UpdateDeckInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteDeckArgs = {
  input: DeleteDeckInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateGuideArgs = {
  input: CreateGuideInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateGuideArgs = {
  input: UpdateGuideInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteGuideArgs = {
  input: DeleteGuideInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreatePublicUserArgs = {
  input: CreatePublicUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdatePublicUserArgs = {
  input: UpdatePublicUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeletePublicUserArgs = {
  input: DeletePublicUserInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateUserFriendsArgs = {
  input: CreateUserFriendsInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateUserFriendsArgs = {
  input: UpdateUserFriendsInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteUserFriendsArgs = {
  input: DeleteUserFriendsInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateUserProfileArgs = {
  input: CreateUserProfileInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteUserProfileArgs = {
  input: DeleteUserProfileInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateWeaknessSetArgs = {
  input: CreateWeaknessSetInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateWeaknessSetArgs = {
  input: UpdateWeaknessSetInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteWeaknessSetArgs = {
  input: DeleteWeaknessSetInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateFileArgs = {
  input: CreateFileInput;
};


/** Mutation is the top level type for mutations. */
export type MutationSignUpArgs = {
  input: SignUpInput;
};


/** Mutation is the top level type for mutations. */
export type MutationLogInWithArgs = {
  input: LogInWithInput;
};


/** Mutation is the top level type for mutations. */
export type MutationLogInArgs = {
  input: LogInInput;
};


/** Mutation is the top level type for mutations. */
export type MutationLogOutArgs = {
  input: LogOutInput;
};


/** Mutation is the top level type for mutations. */
export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


/** Mutation is the top level type for mutations. */
export type MutationSendVerificationEmailArgs = {
  input: SendVerificationEmailInput;
};


/** Mutation is the top level type for mutations. */
export type MutationChallengeArgs = {
  input: ChallengeInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCallCloudCodeArgs = {
  input: CallCloudCodeInput;
};


/** Mutation is the top level type for mutations. */
export type MutationCreateClassArgs = {
  input: CreateClassInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateClassArgs = {
  input: UpdateClassInput;
};


/** Mutation is the top level type for mutations. */
export type MutationDeleteClassArgs = {
  input: DeleteClassInput;
};


/** Mutation is the top level type for mutations. */
export type MutationUpdateHandleArgs = {
  handle: Scalars['String'];
};







/** The FileInfo object type is used to return the information about files. */
export type FileInfo = {
  __typename?: 'FileInfo';
  /** This is the file name. */
  name: Scalars['String'];
  /** This is the url in which the file can be downloaded. */
  url: Scalars['String'];
};

export type FileInput = {
  /** A File Scalar can be an url or a FileInfo object. If this field is set to null the file will be unlinked. */
  file?: Maybe<Scalars['File']>;
  /** Use this field if you want to create a new file. */
  upload?: Maybe<Scalars['Upload']>;
  /** Use this field if you want to unlink the file (the file will not be deleted on cloud storage) */
  unlink?: Maybe<Scalars['Boolean']>;
};

/** The GeoPointInput type is used in operations that involve inputting fields of type geo point. */
export type GeoPointInput = {
  /** This is the latitude. */
  latitude: Scalars['Float'];
  /** This is the longitude. */
  longitude: Scalars['Float'];
};

/** The GeoPoint object type is used to return the information about geo point fields. */
export type GeoPoint = {
  __typename?: 'GeoPoint';
  /** This is the latitude. */
  latitude: Scalars['Float'];
  /** This is the longitude. */
  longitude: Scalars['Float'];
};

/** The ParseObject interface type is used as a base type for the auto generated object types. */
export type ParseObject = {
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
};

/** The ReadPreference enum type is used in queries in order to select in which database replica the operation must run. */
export enum ReadPreference {
  Primary = 'PRIMARY',
  PrimaryPreferred = 'PRIMARY_PREFERRED',
  Secondary = 'SECONDARY',
  SecondaryPreferred = 'SECONDARY_PREFERRED',
  Nearest = 'NEAREST'
}

/** The ReadOptionsInputt type is used in queries in order to set the read preferences. */
export type ReadOptionsInput = {
  /** The read preference for the main query to be executed. */
  readPreference?: Maybe<ReadPreference>;
  /** The read preference for the queries to be executed to include fields. */
  includeReadPreference?: Maybe<ReadPreference>;
  /** The read preference for the subqueries that may be required. */
  subqueryReadPreference?: Maybe<ReadPreference>;
};

/** The SearchInput type is used to specifiy a search operation on a full text search. */
export type SearchInput = {
  /** This is the term to be searched. */
  term: Scalars['String'];
  /** This is the language to tetermine the list of stop words and the rules for tokenizer. */
  language?: Maybe<Scalars['String']>;
  /** This is the flag to enable or disable case sensitive search. */
  caseSensitive?: Maybe<Scalars['Boolean']>;
  /** This is the flag to enable or disable diacritic sensitive search. */
  diacriticSensitive?: Maybe<Scalars['Boolean']>;
};

/** The TextInput type is used to specify a text operation on a constraint. */
export type TextInput = {
  /** This is the search to be executed. */
  search: SearchInput;
};

/** The BoxInput type is used to specifiy a box operation on a within geo query. */
export type BoxInput = {
  /** This is the bottom left coordinates of the box. */
  bottomLeft: GeoPointInput;
  /** This is the upper right coordinates of the box. */
  upperRight: GeoPointInput;
};

/** The WithinInput type is used to specify a within operation on a constraint. */
export type WithinInput = {
  /** This is the box to be specified. */
  box: BoxInput;
};

/** The CenterSphereInput type is used to specifiy a centerSphere operation on a geoWithin query. */
export type CenterSphereInput = {
  /** This is the center of the sphere. */
  center: GeoPointInput;
  /** This is the radius of the sphere. */
  distance: Scalars['Float'];
};

/** The GeoWithinInput type is used to specify a geoWithin operation on a constraint. */
export type GeoWithinInput = {
  /** This is the polygon to be specified. */
  polygon?: Maybe<Array<GeoPointInput>>;
  /** This is the sphere to be specified. */
  centerSphere?: Maybe<CenterSphereInput>;
};

/** The GeoIntersectsInput type is used to specify a geoIntersects operation on a constraint. */
export type GeoIntersectsInput = {
  /** This is the point to be specified. */
  point?: Maybe<GeoPointInput>;
};

/** The IdWhereInput input type is used in operations that involve filtering objects by an id. */
export type IdWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['ID']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['ID']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['ID']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['ID']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['ID']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['ID']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The StringWhereInput input type is used in operations that involve filtering objects by a field of type String. */
export type StringWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the matchesRegex operator to specify a constraint to select the objects where the value of a field matches a specified regular expression. */
  matchesRegex?: Maybe<Scalars['String']>;
  /** This is the options operator to specify optional flags (such as "i" and "m") to be added to a matchesRegex operation in the same set of constraints. */
  options?: Maybe<Scalars['String']>;
  /** This is the $text operator to specify a full text search constraint. */
  text?: Maybe<TextInput>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The NumberWhereInput input type is used in operations that involve filtering objects by a field of type Number. */
export type NumberWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['Float']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['Float']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['Float']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['Float']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['Float']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['Float']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The BooleanWhereInput input type is used in operations that involve filtering objects by a field of type Boolean. */
export type BooleanWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The ArrayWhereInput input type is used in operations that involve filtering objects by a field of type Array. */
export type ArrayWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['Any']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['Any']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['Any']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Any']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['Any']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Any']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the containedBy operator to specify a constraint to select the objects where the values of an array field is contained by another specified array. */
  containedBy?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the contains operator to specify a constraint to select the objects where the values of an array field contain all elements of another specified array. */
  contains?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** An entry from an object, i.e., a pair of key and value. */
export type KeyValueInput = {
  /** The key used to retrieve the value of this entry. */
  key: Scalars['String'];
  /** The value of the entry. Could be any type of scalar data. */
  value: Scalars['Any'];
};

/** The ObjectWhereInput input type is used in operations that involve filtering result by a field of type Object. */
export type ObjectWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<KeyValueInput>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<KeyValueInput>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<KeyValueInput>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<KeyValueInput>>>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<KeyValueInput>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<KeyValueInput>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<KeyValueInput>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<KeyValueInput>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The DateWhereInput input type is used in operations that involve filtering objects by a field of type Date. */
export type DateWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['Date']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['Date']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['Date']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['Date']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['Date']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['Date']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The BytesWhereInput input type is used in operations that involve filtering objects by a field of type Bytes. */
export type BytesWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['Bytes']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['Bytes']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['Bytes']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Bytes']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['Bytes']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Bytes']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['Bytes']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['Bytes']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The FileWhereInput input type is used in operations that involve filtering objects by a field of type File. */
export type FileWhereInput = {
  /** This is the equalTo operator to specify a constraint to select the objects where the value of a field equals to a specified value. */
  equalTo?: Maybe<Scalars['File']>;
  /** This is the notEqualTo operator to specify a constraint to select the objects where the value of a field do not equal to a specified value. */
  notEqualTo?: Maybe<Scalars['File']>;
  /** This is the lessThan operator to specify a constraint to select the objects where the value of a field is less than a specified value. */
  lessThan?: Maybe<Scalars['File']>;
  /** This is the lessThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is less than or equal to a specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['File']>;
  /** This is the greaterThan operator to specify a constraint to select the objects where the value of a field is greater than a specified value. */
  greaterThan?: Maybe<Scalars['File']>;
  /** This is the greaterThanOrEqualTo operator to specify a constraint to select the objects where the value of a field is greater than or equal to a specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['File']>;
  /** This is the in operator to specify a constraint to select the objects where the value of a field equals any value in the specified array. */
  in?: Maybe<Array<Maybe<Scalars['File']>>>;
  /** This is the notIn operator to specify a constraint to select the objects where the value of a field do not equal any value in the specified array. */
  notIn?: Maybe<Array<Maybe<Scalars['File']>>>;
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the matchesRegex operator to specify a constraint to select the objects where the value of a field matches a specified regular expression. */
  matchesRegex?: Maybe<Scalars['String']>;
  /** This is the options operator to specify optional flags (such as "i" and "m") to be added to a matchesRegex operation in the same set of constraints. */
  options?: Maybe<Scalars['String']>;
  /** This is the inQueryKey operator to specify a constraint to select the objects where a field equals to a key in the result of a different query. */
  inQueryKey?: Maybe<SelectInput>;
  /** This is the notInQueryKey operator to specify a constraint to select the objects where a field do not equal to a key in the result of a different query. */
  notInQueryKey?: Maybe<SelectInput>;
};

/** The GeoPointWhereInput input type is used in operations that involve filtering objects by a field of type GeoPoint. */
export type GeoPointWhereInput = {
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the nearSphere operator to specify a constraint to select the objects where the values of a geo point field is near to another geo point. */
  nearSphere?: Maybe<GeoPointInput>;
  /** This is the maxDistance operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in radians) from the geo point specified in the $nearSphere operator. */
  maxDistance?: Maybe<Scalars['Float']>;
  /** This is the maxDistanceInRadians operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in radians) from the geo point specified in the $nearSphere operator. */
  maxDistanceInRadians?: Maybe<Scalars['Float']>;
  /** This is the maxDistanceInMiles operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in miles) from the geo point specified in the $nearSphere operator. */
  maxDistanceInMiles?: Maybe<Scalars['Float']>;
  /** This is the maxDistanceInKilometers operator to specify a constraint to select the objects where the values of a geo point field is at a max distance (in kilometers) from the geo point specified in the $nearSphere operator. */
  maxDistanceInKilometers?: Maybe<Scalars['Float']>;
  /** This is the within operator to specify a constraint to select the objects where the values of a geo point field is within a specified box. */
  within?: Maybe<WithinInput>;
  /** This is the geoWithin operator to specify a constraint to select the objects where the values of a geo point field is within a specified polygon or sphere. */
  geoWithin?: Maybe<GeoWithinInput>;
};

/** The PolygonWhereInput input type is used in operations that involve filtering objects by a field of type Polygon. */
export type PolygonWhereInput = {
  /** This is the exists operator to specify a constraint to select the objects where a field exists (or do not exist). */
  exists?: Maybe<Scalars['Boolean']>;
  /** This is the geoIntersects operator to specify a constraint to select the objects where the values of a polygon field intersect a specified point. */
  geoIntersects?: Maybe<GeoIntersectsInput>;
};

/** The Element object type is used to return array items' value. */
export type Element = {
  __typename?: 'Element';
  /** Return the value of the element in the array */
  value: Scalars['Any'];
};

/** Allow to manage access rights. If not provided object will be publicly readable and writable */
export type AclInput = {
  /** Access control list for users. */
  users?: Maybe<Array<UserAclInput>>;
  /** Access control list for roles. */
  roles?: Maybe<Array<RoleAclInput>>;
  /** Public access control list. */
  public?: Maybe<PublicAclInput>;
};

/** Allow to manage users in ACL. */
export type UserAclInput = {
  /** ID of the targetted User. */
  userId: Scalars['ID'];
  /** Allow the user to read the current object. */
  read: Scalars['Boolean'];
  /** Allow the user to write on the current object. */
  write: Scalars['Boolean'];
};

/** Allow to manage roles in ACL. */
export type RoleAclInput = {
  /** Name of the targetted Role. */
  roleName: Scalars['String'];
  /** Allow users who are members of the role to read the current object. */
  read: Scalars['Boolean'];
  /** Allow users who are members of the role to write on the current object. */
  write: Scalars['Boolean'];
};

/** Allow to manage public rights. */
export type PublicAclInput = {
  /** Allow anyone to read the current object. */
  read: Scalars['Boolean'];
  /** Allow anyone to write on the current object. */
  write: Scalars['Boolean'];
};

/** Current access control list of the current object. */
export type Acl = {
  __typename?: 'ACL';
  /** Access control list for users. */
  users?: Maybe<Array<UserAcl>>;
  /** Access control list for roles. */
  roles?: Maybe<Array<RoleAcl>>;
  /** Public access control list. */
  public?: Maybe<PublicAcl>;
};

/** Allow to manage users in ACL. If read and write are null the users have read and write rights. */
export type UserAcl = {
  __typename?: 'UserACL';
  /** ID of the targetted User. */
  userId: Scalars['ID'];
  /** Allow the user to read the current object. */
  read: Scalars['Boolean'];
  /** Allow the user to write on the current object. */
  write: Scalars['Boolean'];
};

/** Allow to manage roles in ACL. If read and write are null the role have read and write rights. */
export type RoleAcl = {
  __typename?: 'RoleACL';
  /** Name of the targetted Role. */
  roleName: Scalars['ID'];
  /** Allow users who are members of the role to read the current object. */
  read: Scalars['Boolean'];
  /** Allow users who are members of the role to write on the current object. */
  write: Scalars['Boolean'];
};

/** Allow to manage public rights. */
export type PublicAcl = {
  __typename?: 'PublicACL';
  /** Allow anyone to read the current object. */
  read?: Maybe<Scalars['Boolean']>;
  /** Allow anyone to write on the current object. */
  write?: Maybe<Scalars['Boolean']>;
};

/** The SubqueryInput type is used to specify a sub query to another class. */
export type SubqueryInput = {
  /** This is the class name of the object. */
  className: Scalars['String'];
  /** These are the conditions that the objects need to match in order to be found */
  where: Scalars['Object'];
};

/** The SelectInput type is used to specify an inQueryKey or a notInQueryKey operation on a constraint. */
export type SelectInput = {
  /** This is the subquery to be executed. */
  query: SubqueryInput;
  /** This is the key in the result of the subquery that must match (not match) the field. */
  key: Scalars['String'];
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID'];
};

/** The SchemaFieldInput is used to specify a field of an object class schema. */
export type SchemaFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaStringFieldInput is used to specify a field of type string for an object class schema. */
export type SchemaStringFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaStringField is used to return information of a String field. */
export type SchemaStringField = SchemaField & {
  __typename?: 'SchemaStringField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaField interface type is used as a base type for the different supported fields of an object class schema. */
export type SchemaField = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaNumberFieldInput is used to specify a field of type number for an object class schema. */
export type SchemaNumberFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaNumberField is used to return information of a Number field. */
export type SchemaNumberField = SchemaField & {
  __typename?: 'SchemaNumberField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaBooleanFieldInput is used to specify a field of type boolean for an object class schema. */
export type SchemaBooleanFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaBooleanField is used to return information of a Boolean field. */
export type SchemaBooleanField = SchemaField & {
  __typename?: 'SchemaBooleanField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaArrayFieldInput is used to specify a field of type array for an object class schema. */
export type SchemaArrayFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaArrayField is used to return information of an Array field. */
export type SchemaArrayField = SchemaField & {
  __typename?: 'SchemaArrayField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaObjectFieldInput is used to specify a field of type object for an object class schema. */
export type SchemaObjectFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaObjectField is used to return information of an Object field. */
export type SchemaObjectField = SchemaField & {
  __typename?: 'SchemaObjectField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaDateFieldInput is used to specify a field of type date for an object class schema. */
export type SchemaDateFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaDateField is used to return information of a Date field. */
export type SchemaDateField = SchemaField & {
  __typename?: 'SchemaDateField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaFileFieldInput is used to specify a field of type file for an object class schema. */
export type SchemaFileFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaFileField is used to return information of a File field. */
export type SchemaFileField = SchemaField & {
  __typename?: 'SchemaFileField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaGeoPointFieldInput is used to specify a field of type geo point for an object class schema. */
export type SchemaGeoPointFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaGeoPointField is used to return information of a Geo Point field. */
export type SchemaGeoPointField = SchemaField & {
  __typename?: 'SchemaGeoPointField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaPolygonFieldInput is used to specify a field of type polygon for an object class schema. */
export type SchemaPolygonFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaPolygonField is used to return information of a Polygon field. */
export type SchemaPolygonField = SchemaField & {
  __typename?: 'SchemaPolygonField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaBytesFieldInput is used to specify a field of type bytes for an object class schema. */
export type SchemaBytesFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
};

/** The SchemaBytesField is used to return information of a Bytes field. */
export type SchemaBytesField = SchemaField & {
  __typename?: 'SchemaBytesField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The PointerFieldInput is used to specify a field of type pointer for an object class schema. */
export type PointerFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
  /** This is the name of the target class for the field. */
  targetClassName: Scalars['String'];
};

/** The SchemaPointerField is used to return information of a Pointer field. */
export type SchemaPointerField = SchemaField & {
  __typename?: 'SchemaPointerField';
  /** This is the field name. */
  name: Scalars['String'];
  /** This is the name of the target class for the field. */
  targetClassName: Scalars['String'];
};

/** The RelationFieldInput is used to specify a field of type relation for an object class schema. */
export type RelationFieldInput = {
  /** This is the field name. */
  name: Scalars['String'];
  /** This is the name of the target class for the field. */
  targetClassName: Scalars['String'];
};

/** The SchemaRelationField is used to return information of a Relation field. */
export type SchemaRelationField = SchemaField & {
  __typename?: 'SchemaRelationField';
  /** This is the field name. */
  name: Scalars['String'];
  /** This is the name of the target class for the field. */
  targetClassName: Scalars['String'];
};

/** The SchemaACLField is used to return information of an ACL field. */
export type SchemaAclField = SchemaField & {
  __typename?: 'SchemaACLField';
  /** This is the field name. */
  name: Scalars['String'];
};

/** The CreateClassSchemaInput type is used to specify the schema for a new object class to be created. */
export type SchemaFieldsInput = {
  /** These are the String fields to be added to the class schema. */
  addStrings?: Maybe<Array<SchemaStringFieldInput>>;
  /** These are the Number fields to be added to the class schema. */
  addNumbers?: Maybe<Array<SchemaNumberFieldInput>>;
  /** These are the Boolean fields to be added to the class schema. */
  addBooleans?: Maybe<Array<SchemaBooleanFieldInput>>;
  /** These are the Array fields to be added to the class schema. */
  addArrays?: Maybe<Array<SchemaArrayFieldInput>>;
  /** These are the Object fields to be added to the class schema. */
  addObjects?: Maybe<Array<SchemaObjectFieldInput>>;
  /** These are the Date fields to be added to the class schema. */
  addDates?: Maybe<Array<SchemaDateFieldInput>>;
  /** These are the File fields to be added to the class schema. */
  addFiles?: Maybe<Array<SchemaFileFieldInput>>;
  /** This is the Geo Point field to be added to the class schema. Currently it is supported only one GeoPoint field per Class. */
  addGeoPoint?: Maybe<SchemaGeoPointFieldInput>;
  /** These are the Polygon fields to be added to the class schema. */
  addPolygons?: Maybe<Array<SchemaPolygonFieldInput>>;
  /** These are the Bytes fields to be added to the class schema. */
  addBytes?: Maybe<Array<SchemaBytesFieldInput>>;
  /** These are the Pointer fields to be added to the class schema. */
  addPointers?: Maybe<Array<PointerFieldInput>>;
  /** These are the Relation fields to be added to the class schema. */
  addRelations?: Maybe<Array<RelationFieldInput>>;
  /** These are the fields to be removed from the class schema. */
  remove?: Maybe<Array<SchemaFieldInput>>;
};

/** The Class type is used to return the information about an object class. */
export type Class = {
  __typename?: 'Class';
  /** This is the name of the object class. */
  name: Scalars['String'];
  /** These are the schema's fields of the object class. */
  schemaFields: Array<SchemaField>;
};

/** The CreateRoleFieldsInput input type is used in operations that involve creation of objects in the Role class. */
export type CreateRoleFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object name. */
  name?: Maybe<Scalars['String']>;
  /** This is the object users. */
  users?: Maybe<UserRelationInput>;
  /** This is the object roles. */
  roles?: Maybe<RoleRelationInput>;
};

/** The UpdateRoleFieldsInput input type is used in operations that involve creation of objects in the Role class. */
export type UpdateRoleFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object name. */
  name?: Maybe<Scalars['String']>;
  /** This is the object users. */
  users?: Maybe<UserRelationInput>;
  /** This is the object roles. */
  roles?: Maybe<RoleRelationInput>;
};

/** Allow to link OR add and link an object of the Role class. */
export type RolePointerInput = {
  /** Link an existing object from Role class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from Role class. */
  createAndLink?: Maybe<CreateRoleFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the Role class into a relation field. */
export type RoleRelationInput = {
  /** Add existing objects from the Role class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the Role class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the Role class into the relation. */
  createAndAdd?: Maybe<Array<CreateRoleFieldsInput>>;
};

/** The RoleWhereInput input type is used in operations that involve filtering objects of Role class. */
export type RoleWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object name. */
  name?: Maybe<StringWhereInput>;
  /** This is the object users. */
  users?: Maybe<UserRelationWhereInput>;
  /** This is the object roles. */
  roles?: Maybe<RoleRelationWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<RoleWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<RoleWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<RoleWhereInput>>;
};

/** The RoleRelationWhereInput input type is used in operations that involve filtering objects of Role class. */
export type RoleRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<RoleWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<RoleWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The RoleOrder input type is used when sorting objects of the Role class. */
export enum RoleOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  UsersAsc = 'users_ASC',
  UsersDesc = 'users_DESC',
  RolesAsc = 'roles_ASC',
  RolesDesc = 'roles_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The Role object type is used in operations that involve outputting objects of Role class. */
export type Role = ParseObject & Node & {
  __typename?: 'Role';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** This is the object name. */
  name?: Maybe<Scalars['String']>;
  /** This is the object users. */
  users: UserConnection;
  /** This is the object roles. */
  roles: RoleConnection;
};


/** The Role object type is used in operations that involve outputting objects of Role class. */
export type RoleUsersArgs = {
  where?: Maybe<UserWhereInput>;
  order?: Maybe<Array<UserOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};


/** The Role object type is used in operations that involve outputting objects of Role class. */
export type RoleRolesArgs = {
  where?: Maybe<RoleWhereInput>;
  order?: Maybe<Array<RoleOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};

/** An edge in a connection. */
export type RoleEdge = {
  __typename?: 'RoleEdge';
  /** The item at the end of the edge */
  node?: Maybe<Role>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type RoleConnection = {
  __typename?: 'RoleConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<RoleEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

export type CreateRoleInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateRoleFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateRolePayload = {
  __typename?: 'CreateRolePayload';
  /** This is the created object. */
  role: Role;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateRoleInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateRoleFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateRolePayload = {
  __typename?: 'UpdateRolePayload';
  /** This is the updated object. */
  role: Role;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteRoleInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteRolePayload = {
  __typename?: 'DeleteRolePayload';
  /** This is the deleted object. */
  role: Role;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateSessionFieldsInput input type is used in operations that involve creation of objects in the Session class. */
export type CreateSessionFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object restricted. */
  restricted?: Maybe<Scalars['Boolean']>;
  /** This is the object user. */
  user?: Maybe<UserPointerInput>;
  /** This is the object installationId. */
  installationId?: Maybe<Scalars['String']>;
  /** This is the object sessionToken. */
  sessionToken?: Maybe<Scalars['String']>;
  /** This is the object expiresAt. */
  expiresAt?: Maybe<Scalars['Date']>;
  /** This is the object createdWith. */
  createdWith?: Maybe<Scalars['Object']>;
};

/** The UpdateSessionFieldsInput input type is used in operations that involve creation of objects in the Session class. */
export type UpdateSessionFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object restricted. */
  restricted?: Maybe<Scalars['Boolean']>;
  /** This is the object user. */
  user?: Maybe<UserPointerInput>;
  /** This is the object installationId. */
  installationId?: Maybe<Scalars['String']>;
  /** This is the object sessionToken. */
  sessionToken?: Maybe<Scalars['String']>;
  /** This is the object expiresAt. */
  expiresAt?: Maybe<Scalars['Date']>;
  /** This is the object createdWith. */
  createdWith?: Maybe<Scalars['Object']>;
};

/** Allow to link OR add and link an object of the Session class. */
export type SessionPointerInput = {
  /** Link an existing object from Session class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from Session class. */
  createAndLink?: Maybe<CreateSessionFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the Session class into a relation field. */
export type SessionRelationInput = {
  /** Add existing objects from the Session class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the Session class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the Session class into the relation. */
  createAndAdd?: Maybe<Array<CreateSessionFieldsInput>>;
};

/** The SessionWhereInput input type is used in operations that involve filtering objects of Session class. */
export type SessionWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object restricted. */
  restricted?: Maybe<BooleanWhereInput>;
  /** This is the object user. */
  user?: Maybe<UserRelationWhereInput>;
  /** This is the object installationId. */
  installationId?: Maybe<StringWhereInput>;
  /** This is the object sessionToken. */
  sessionToken?: Maybe<StringWhereInput>;
  /** This is the object expiresAt. */
  expiresAt?: Maybe<DateWhereInput>;
  /** This is the object createdWith. */
  createdWith?: Maybe<ObjectWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<SessionWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<SessionWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<SessionWhereInput>>;
};

/** The SessionRelationWhereInput input type is used in operations that involve filtering objects of Session class. */
export type SessionRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<SessionWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<SessionWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The SessionOrder input type is used when sorting objects of the Session class. */
export enum SessionOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  RestrictedAsc = 'restricted_ASC',
  RestrictedDesc = 'restricted_DESC',
  UserAsc = 'user_ASC',
  UserDesc = 'user_DESC',
  InstallationIdAsc = 'installationId_ASC',
  InstallationIdDesc = 'installationId_DESC',
  SessionTokenAsc = 'sessionToken_ASC',
  SessionTokenDesc = 'sessionToken_DESC',
  ExpiresAtAsc = 'expiresAt_ASC',
  ExpiresAtDesc = 'expiresAt_DESC',
  CreatedWithAsc = 'createdWith_ASC',
  CreatedWithDesc = 'createdWith_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The Session object type is used in operations that involve outputting objects of Session class. */
export type Session = ParseObject & Node & {
  __typename?: 'Session';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** This is the object restricted. */
  restricted?: Maybe<Scalars['Boolean']>;
  /** This is the object user. */
  user?: Maybe<User>;
  /** This is the object installationId. */
  installationId?: Maybe<Scalars['String']>;
  /** This is the object sessionToken. */
  sessionToken?: Maybe<Scalars['String']>;
  /** This is the object expiresAt. */
  expiresAt?: Maybe<Scalars['Date']>;
  /** This is the object createdWith. */
  createdWith?: Maybe<Scalars['Object']>;
};

/** An edge in a connection. */
export type SessionEdge = {
  __typename?: 'SessionEdge';
  /** The item at the end of the edge */
  node?: Maybe<Session>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type SessionConnection = {
  __typename?: 'SessionConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<SessionEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateSessionInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateSessionFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateSessionPayload = {
  __typename?: 'CreateSessionPayload';
  /** This is the created object. */
  session: Session;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateSessionInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateSessionFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateSessionPayload = {
  __typename?: 'UpdateSessionPayload';
  /** This is the updated object. */
  session: Session;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteSessionInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteSessionPayload = {
  __typename?: 'DeleteSessionPayload';
  /** This is the deleted object. */
  session: Session;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateUserFieldsInput input type is used in operations that involve creation of objects in the User class. */
export type CreateUserFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object username. */
  username?: Maybe<Scalars['String']>;
  /** This is the object password. */
  password?: Maybe<Scalars['String']>;
  /** This is the object email. */
  email?: Maybe<Scalars['String']>;
  /** This is the object emailVerified. */
  emailVerified?: Maybe<Scalars['Boolean']>;
  /** This is the object authData. */
  authData?: Maybe<Scalars['Object']>;
};

/** The UpdateUserFieldsInput input type is used in operations that involve creation of objects in the User class. */
export type UpdateUserFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object username. */
  username?: Maybe<Scalars['String']>;
  /** This is the object password. */
  password?: Maybe<Scalars['String']>;
  /** This is the object email. */
  email?: Maybe<Scalars['String']>;
  /** This is the object emailVerified. */
  emailVerified?: Maybe<Scalars['Boolean']>;
  /** This is the object authData. */
  authData?: Maybe<Scalars['Object']>;
};

/** Allow to link OR add and link an object of the User class. */
export type UserPointerInput = {
  /** Link an existing object from User class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from User class. */
  createAndLink?: Maybe<CreateUserFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the User class into a relation field. */
export type UserRelationInput = {
  /** Add existing objects from the User class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the User class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the User class into the relation. */
  createAndAdd?: Maybe<Array<CreateUserFieldsInput>>;
};

/** The UserWhereInput input type is used in operations that involve filtering objects of User class. */
export type UserWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object username. */
  username?: Maybe<StringWhereInput>;
  /** This is the object password. */
  password?: Maybe<StringWhereInput>;
  /** This is the object email. */
  email?: Maybe<StringWhereInput>;
  /** This is the object emailVerified. */
  emailVerified?: Maybe<BooleanWhereInput>;
  /** This is the object authData. */
  authData?: Maybe<ObjectWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<UserWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<UserWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<UserWhereInput>>;
};

/** The UserRelationWhereInput input type is used in operations that involve filtering objects of User class. */
export type UserRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<UserWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<UserWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The UserOrder input type is used when sorting objects of the User class. */
export enum UserOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  UsernameAsc = 'username_ASC',
  UsernameDesc = 'username_DESC',
  PasswordAsc = 'password_ASC',
  PasswordDesc = 'password_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  EmailVerifiedAsc = 'emailVerified_ASC',
  EmailVerifiedDesc = 'emailVerified_DESC',
  AuthDataAsc = 'authData_ASC',
  AuthDataDesc = 'authData_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The User object type is used in operations that involve outputting objects of User class. */
export type User = ParseObject & Node & {
  __typename?: 'User';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** auth provider response when triggered on signUp/logIn. */
  authDataResponse?: Maybe<Scalars['Object']>;
  /** This is the object username. */
  username?: Maybe<Scalars['String']>;
  /** This is the object email. */
  email?: Maybe<Scalars['String']>;
  /** This is the object emailVerified. */
  emailVerified?: Maybe<Scalars['Boolean']>;
  /** This is the object authData. */
  authData?: Maybe<Scalars['Object']>;
};

/** An edge in a connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** The item at the end of the edge */
  node?: Maybe<User>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

/** The Viewer object type is used in operations that involve outputting the current user data. */
export type Viewer = {
  __typename?: 'Viewer';
  /** The current user session token. */
  sessionToken: Scalars['String'];
  /** This is the current user. */
  user: User;
};

export type CreateUserInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateUserFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /** This is the created object. */
  user: User;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateUserFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /** This is the updated object. */
  user: User;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /** This is the deleted object. */
  user: User;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateCampaignFieldsInput input type is used in operations that involve creation of objects in the Campaign class. */
export type CreateCampaignFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object campaign. */
  campaign?: Maybe<Scalars['Object']>;
  /** This is the object guide. */
  guide?: Maybe<GuidePointerInput>;
  /** This is the object linkCampaignA. */
  linkCampaignA?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideA. */
  linkGuideA?: Maybe<GuidePointerInput>;
  /** This is the object linkCampaignB. */
  linkCampaignB?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideB. */
  linkGuideB?: Maybe<GuidePointerInput>;
};

/** The UpdateCampaignFieldsInput input type is used in operations that involve creation of objects in the Campaign class. */
export type UpdateCampaignFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object campaign. */
  campaign?: Maybe<Scalars['Object']>;
  /** This is the object guide. */
  guide?: Maybe<GuidePointerInput>;
  /** This is the object linkCampaignA. */
  linkCampaignA?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideA. */
  linkGuideA?: Maybe<GuidePointerInput>;
  /** This is the object linkCampaignB. */
  linkCampaignB?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideB. */
  linkGuideB?: Maybe<GuidePointerInput>;
};

/** Allow to link OR add and link an object of the Campaign class. */
export type CampaignPointerInput = {
  /** Link an existing object from Campaign class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from Campaign class. */
  createAndLink?: Maybe<CreateCampaignFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the Campaign class into a relation field. */
export type CampaignRelationInput = {
  /** Add existing objects from the Campaign class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the Campaign class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the Campaign class into the relation. */
  createAndAdd?: Maybe<Array<CreateCampaignFieldsInput>>;
};

/** The CampaignWhereInput input type is used in operations that involve filtering objects of Campaign class. */
export type CampaignWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object campaign. */
  campaign?: Maybe<Scalars['Object']>;
  /** This is the object guide. */
  guide?: Maybe<GuideRelationWhereInput>;
  /** This is the object linkCampaignA. */
  linkCampaignA?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideA. */
  linkGuideA?: Maybe<GuideRelationWhereInput>;
  /** This is the object linkCampaignB. */
  linkCampaignB?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideB. */
  linkGuideB?: Maybe<GuideRelationWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<CampaignWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<CampaignWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<CampaignWhereInput>>;
};

/** The CampaignRelationWhereInput input type is used in operations that involve filtering objects of Campaign class. */
export type CampaignRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<CampaignWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<CampaignWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The CampaignOrder input type is used when sorting objects of the Campaign class. */
export enum CampaignOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  CampaignAsc = 'campaign_ASC',
  CampaignDesc = 'campaign_DESC',
  GuideAsc = 'guide_ASC',
  GuideDesc = 'guide_DESC',
  LinkCampaignAAsc = 'linkCampaignA_ASC',
  LinkCampaignADesc = 'linkCampaignA_DESC',
  LinkGuideAAsc = 'linkGuideA_ASC',
  LinkGuideADesc = 'linkGuideA_DESC',
  LinkCampaignBAsc = 'linkCampaignB_ASC',
  LinkCampaignBDesc = 'linkCampaignB_DESC',
  LinkGuideBAsc = 'linkGuideB_ASC',
  LinkGuideBDesc = 'linkGuideB_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The Campaign object type is used in operations that involve outputting objects of Campaign class. */
export type Campaign = ParseObject & Node & {
  __typename?: 'Campaign';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** This is the object campaign. */
  campaign?: Maybe<Scalars['Object']>;
  /** This is the object guide. */
  guide?: Maybe<Guide>;
  /** This is the object linkCampaignA. */
  linkCampaignA?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideA. */
  linkGuideA?: Maybe<Guide>;
  /** This is the object linkCampaignB. */
  linkCampaignB?: Maybe<Scalars['Object']>;
  /** This is the object linkGuideB. */
  linkGuideB?: Maybe<Guide>;
};

/** An edge in a connection. */
export type CampaignEdge = {
  __typename?: 'CampaignEdge';
  /** The item at the end of the edge */
  node?: Maybe<Campaign>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type CampaignConnection = {
  __typename?: 'CampaignConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<CampaignEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateCampaignInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateCampaignFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateCampaignPayload = {
  __typename?: 'CreateCampaignPayload';
  /** This is the created object. */
  campaign: Campaign;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateCampaignInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateCampaignFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateCampaignPayload = {
  __typename?: 'UpdateCampaignPayload';
  /** This is the updated object. */
  campaign: Campaign;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCampaignInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteCampaignPayload = {
  __typename?: 'DeleteCampaignPayload';
  /** This is the deleted object. */
  campaign: Campaign;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateDeckFieldsInput input type is used in operations that involve creation of objects in the Deck class. */
export type CreateDeckFieldsInput = {
  ACL?: Maybe<AclInput>;
};

/** The UpdateDeckFieldsInput input type is used in operations that involve creation of objects in the Deck class. */
export type UpdateDeckFieldsInput = {
  ACL?: Maybe<AclInput>;
};

/** Allow to link OR add and link an object of the Deck class. */
export type DeckPointerInput = {
  /** Link an existing object from Deck class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from Deck class. */
  createAndLink?: Maybe<CreateDeckFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the Deck class into a relation field. */
export type DeckRelationInput = {
  /** Add existing objects from the Deck class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the Deck class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the Deck class into the relation. */
  createAndAdd?: Maybe<Array<CreateDeckFieldsInput>>;
};

/** The DeckWhereInput input type is used in operations that involve filtering objects of Deck class. */
export type DeckWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<DeckWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<DeckWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<DeckWhereInput>>;
};

/** The DeckRelationWhereInput input type is used in operations that involve filtering objects of Deck class. */
export type DeckRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<DeckWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<DeckWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The DeckOrder input type is used when sorting objects of the Deck class. */
export enum DeckOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The Deck object type is used in operations that involve outputting objects of Deck class. */
export type Deck = ParseObject & Node & {
  __typename?: 'Deck';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
};

/** An edge in a connection. */
export type DeckEdge = {
  __typename?: 'DeckEdge';
  /** The item at the end of the edge */
  node?: Maybe<Deck>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type DeckConnection = {
  __typename?: 'DeckConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<DeckEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateDeckInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateDeckFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDeckPayload = {
  __typename?: 'CreateDeckPayload';
  /** This is the created object. */
  deck: Deck;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDeckInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateDeckFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDeckPayload = {
  __typename?: 'UpdateDeckPayload';
  /** This is the updated object. */
  deck: Deck;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDeckInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDeckPayload = {
  __typename?: 'DeleteDeckPayload';
  /** This is the deleted object. */
  deck: Deck;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateGuideFieldsInput input type is used in operations that involve creation of objects in the Guide class. */
export type CreateGuideFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object inputs. */
  inputs?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object achievements. */
  achievements?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object version. */
  version?: Maybe<Scalars['Float']>;
  /** This is the object uuid. */
  uuid?: Maybe<Scalars['String']>;
};

/** The UpdateGuideFieldsInput input type is used in operations that involve creation of objects in the Guide class. */
export type UpdateGuideFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object inputs. */
  inputs?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object achievements. */
  achievements?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object version. */
  version?: Maybe<Scalars['Float']>;
  /** This is the object uuid. */
  uuid?: Maybe<Scalars['String']>;
};

/** Allow to link OR add and link an object of the Guide class. */
export type GuidePointerInput = {
  /** Link an existing object from Guide class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from Guide class. */
  createAndLink?: Maybe<CreateGuideFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the Guide class into a relation field. */
export type GuideRelationInput = {
  /** Add existing objects from the Guide class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the Guide class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the Guide class into the relation. */
  createAndAdd?: Maybe<Array<CreateGuideFieldsInput>>;
};

/** The GuideWhereInput input type is used in operations that involve filtering objects of Guide class. */
export type GuideWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object inputs. */
  inputs?: Maybe<ArrayWhereInput>;
  /** This is the object achievements. */
  achievements?: Maybe<ArrayWhereInput>;
  /** This is the object version. */
  version?: Maybe<NumberWhereInput>;
  /** This is the object uuid. */
  uuid?: Maybe<StringWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<GuideWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<GuideWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<GuideWhereInput>>;
};

/** The GuideRelationWhereInput input type is used in operations that involve filtering objects of Guide class. */
export type GuideRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<GuideWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<GuideWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The GuideOrder input type is used when sorting objects of the Guide class. */
export enum GuideOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  InputsAsc = 'inputs_ASC',
  InputsDesc = 'inputs_DESC',
  AchievementsAsc = 'achievements_ASC',
  AchievementsDesc = 'achievements_DESC',
  VersionAsc = 'version_ASC',
  VersionDesc = 'version_DESC',
  UuidAsc = 'uuid_ASC',
  UuidDesc = 'uuid_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The Guide object type is used in operations that involve outputting objects of Guide class. */
export type Guide = ParseObject & Node & {
  __typename?: 'Guide';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments */
  inputs?: Maybe<Array<Maybe<ArrayResult>>>;
  /** Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments */
  achievements?: Maybe<Array<Maybe<ArrayResult>>>;
  /** This is the object version. */
  version?: Maybe<Scalars['Float']>;
  /** This is the object uuid. */
  uuid?: Maybe<Scalars['String']>;
};

/** An edge in a connection. */
export type GuideEdge = {
  __typename?: 'GuideEdge';
  /** The item at the end of the edge */
  node?: Maybe<Guide>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type GuideConnection = {
  __typename?: 'GuideConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<GuideEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateGuideInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateGuideFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateGuidePayload = {
  __typename?: 'CreateGuidePayload';
  /** This is the created object. */
  guide: Guide;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateGuideInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateGuideFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateGuidePayload = {
  __typename?: 'UpdateGuidePayload';
  /** This is the updated object. */
  guide: Guide;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteGuideInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteGuidePayload = {
  __typename?: 'DeleteGuidePayload';
  /** This is the deleted object. */
  guide: Guide;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreatePublicUserFieldsInput input type is used in operations that involve creation of objects in the PublicUser class. */
export type CreatePublicUserFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object handle. */
  handle?: Maybe<Scalars['String']>;
  /** This is the object handleNormalized. */
  handleNormalized?: Maybe<Scalars['String']>;
  /** This is the object friends. */
  friends?: Maybe<PublicUserRelationInput>;
};

/** The UpdatePublicUserFieldsInput input type is used in operations that involve creation of objects in the PublicUser class. */
export type UpdatePublicUserFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object handle. */
  handle?: Maybe<Scalars['String']>;
  /** This is the object handleNormalized. */
  handleNormalized?: Maybe<Scalars['String']>;
  /** This is the object friends. */
  friends?: Maybe<PublicUserRelationInput>;
};

/** Allow to link OR add and link an object of the PublicUser class. */
export type PublicUserPointerInput = {
  /** Link an existing object from PublicUser class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from PublicUser class. */
  createAndLink?: Maybe<CreatePublicUserFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the PublicUser class into a relation field. */
export type PublicUserRelationInput = {
  /** Add existing objects from the PublicUser class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the PublicUser class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the PublicUser class into the relation. */
  createAndAdd?: Maybe<Array<CreatePublicUserFieldsInput>>;
};

/** The PublicUserWhereInput input type is used in operations that involve filtering objects of PublicUser class. */
export type PublicUserWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object handle. */
  handle?: Maybe<StringWhereInput>;
  /** This is the object handleNormalized. */
  handleNormalized?: Maybe<StringWhereInput>;
  /** This is the object friends. */
  friends?: Maybe<PublicUserRelationWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<PublicUserWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<PublicUserWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<PublicUserWhereInput>>;
};

/** The PublicUserRelationWhereInput input type is used in operations that involve filtering objects of PublicUser class. */
export type PublicUserRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<PublicUserWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<PublicUserWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The PublicUserOrder input type is used when sorting objects of the PublicUser class. */
export enum PublicUserOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  HandleNormalizedAsc = 'handleNormalized_ASC',
  HandleNormalizedDesc = 'handleNormalized_DESC',
  FriendsAsc = 'friends_ASC',
  FriendsDesc = 'friends_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The PublicUser object type is used in operations that involve outputting objects of PublicUser class. */
export type PublicUser = ParseObject & Node & {
  __typename?: 'PublicUser';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** This is the object handle. */
  handle?: Maybe<Scalars['String']>;
  /** This is the object handleNormalized. */
  handleNormalized?: Maybe<Scalars['String']>;
  /** This is the object friends. */
  friends: PublicUserConnection;
};


/** The PublicUser object type is used in operations that involve outputting objects of PublicUser class. */
export type PublicUserFriendsArgs = {
  where?: Maybe<PublicUserWhereInput>;
  order?: Maybe<Array<PublicUserOrder>>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  options?: Maybe<ReadOptionsInput>;
};

/** An edge in a connection. */
export type PublicUserEdge = {
  __typename?: 'PublicUserEdge';
  /** The item at the end of the edge */
  node?: Maybe<PublicUser>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type PublicUserConnection = {
  __typename?: 'PublicUserConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PublicUserEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreatePublicUserInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreatePublicUserFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreatePublicUserPayload = {
  __typename?: 'CreatePublicUserPayload';
  /** This is the created object. */
  publicUser: PublicUser;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdatePublicUserInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdatePublicUserFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdatePublicUserPayload = {
  __typename?: 'UpdatePublicUserPayload';
  /** This is the updated object. */
  publicUser: PublicUser;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeletePublicUserInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeletePublicUserPayload = {
  __typename?: 'DeletePublicUserPayload';
  /** This is the deleted object. */
  publicUser: PublicUser;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateUserFriendsFieldsInput input type is used in operations that involve creation of objects in the UserFriends class. */
export type CreateUserFriendsFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object user. */
  user: UserPointerInput;
  /** This is the object friends. */
  friends?: Maybe<Scalars['Object']>;
  /** This is the object sent_requests. */
  sent_requests?: Maybe<Scalars['Object']>;
  /** This is the object received_requests. */
  received_requests?: Maybe<Scalars['Object']>;
};

/** The UpdateUserFriendsFieldsInput input type is used in operations that involve creation of objects in the UserFriends class. */
export type UpdateUserFriendsFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object user. */
  user?: Maybe<UserPointerInput>;
  /** This is the object friends. */
  friends?: Maybe<Scalars['Object']>;
  /** This is the object sent_requests. */
  sent_requests?: Maybe<Scalars['Object']>;
  /** This is the object received_requests. */
  received_requests?: Maybe<Scalars['Object']>;
};

/** Allow to link OR add and link an object of the UserFriends class. */
export type UserFriendsPointerInput = {
  /** Link an existing object from UserFriends class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from UserFriends class. */
  createAndLink?: Maybe<CreateUserFriendsFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the UserFriends class into a relation field. */
export type UserFriendsRelationInput = {
  /** Add existing objects from the UserFriends class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the UserFriends class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the UserFriends class into the relation. */
  createAndAdd?: Maybe<Array<CreateUserFriendsFieldsInput>>;
};

/** The UserFriendsWhereInput input type is used in operations that involve filtering objects of UserFriends class. */
export type UserFriendsWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object user. */
  user?: Maybe<UserRelationWhereInput>;
  /** This is the object friends. */
  friends?: Maybe<Scalars['Object']>;
  /** This is the object sent_requests. */
  sent_requests?: Maybe<Scalars['Object']>;
  /** This is the object received_requests. */
  received_requests?: Maybe<Scalars['Object']>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<UserFriendsWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<UserFriendsWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<UserFriendsWhereInput>>;
};

/** The UserFriendsRelationWhereInput input type is used in operations that involve filtering objects of UserFriends class. */
export type UserFriendsRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<UserFriendsWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<UserFriendsWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The UserFriendsOrder input type is used when sorting objects of the UserFriends class. */
export enum UserFriendsOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  UserAsc = 'user_ASC',
  UserDesc = 'user_DESC',
  FriendsAsc = 'friends_ASC',
  FriendsDesc = 'friends_DESC',
  SentRequestsAsc = 'sent_requests_ASC',
  SentRequestsDesc = 'sent_requests_DESC',
  ReceivedRequestsAsc = 'received_requests_ASC',
  ReceivedRequestsDesc = 'received_requests_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The UserFriends object type is used in operations that involve outputting objects of UserFriends class. */
export type UserFriends = ParseObject & Node & {
  __typename?: 'UserFriends';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** This is the object user. */
  user: User;
  /** This is the object friends. */
  friends: Scalars['Object'];
  /** This is the object sent_requests. */
  sent_requests: Scalars['Object'];
  /** This is the object received_requests. */
  received_requests: Scalars['Object'];
};

/** An edge in a connection. */
export type UserFriendsEdge = {
  __typename?: 'UserFriendsEdge';
  /** The item at the end of the edge */
  node?: Maybe<UserFriends>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type UserFriendsConnection = {
  __typename?: 'UserFriendsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<UserFriendsEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateUserFriendsInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateUserFriendsFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateUserFriendsPayload = {
  __typename?: 'CreateUserFriendsPayload';
  /** This is the created object. */
  userFriends: UserFriends;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserFriendsInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateUserFriendsFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserFriendsPayload = {
  __typename?: 'UpdateUserFriendsPayload';
  /** This is the updated object. */
  userFriends: UserFriends;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserFriendsInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserFriendsPayload = {
  __typename?: 'DeleteUserFriendsPayload';
  /** This is the deleted object. */
  userFriends: UserFriends;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateUserProfileFieldsInput input type is used in operations that involve creation of objects in the UserProfile class. */
export type CreateUserProfileFieldsInput = {
  ACL?: Maybe<AclInput>;
};

/** The UpdateUserProfileFieldsInput input type is used in operations that involve creation of objects in the UserProfile class. */
export type UpdateUserProfileFieldsInput = {
  ACL?: Maybe<AclInput>;
};

/** Allow to link OR add and link an object of the UserProfile class. */
export type UserProfilePointerInput = {
  /** Link an existing object from UserProfile class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from UserProfile class. */
  createAndLink?: Maybe<CreateUserProfileFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the UserProfile class into a relation field. */
export type UserProfileRelationInput = {
  /** Add existing objects from the UserProfile class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the UserProfile class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the UserProfile class into the relation. */
  createAndAdd?: Maybe<Array<CreateUserProfileFieldsInput>>;
};

/** The UserProfileWhereInput input type is used in operations that involve filtering objects of UserProfile class. */
export type UserProfileWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<UserProfileWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<UserProfileWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<UserProfileWhereInput>>;
};

/** The UserProfileRelationWhereInput input type is used in operations that involve filtering objects of UserProfile class. */
export type UserProfileRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<UserProfileWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<UserProfileWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The UserProfileOrder input type is used when sorting objects of the UserProfile class. */
export enum UserProfileOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The UserProfile object type is used in operations that involve outputting objects of UserProfile class. */
export type UserProfile = ParseObject & Node & {
  __typename?: 'UserProfile';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
};

/** An edge in a connection. */
export type UserProfileEdge = {
  __typename?: 'UserProfileEdge';
  /** The item at the end of the edge */
  node?: Maybe<UserProfile>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type UserProfileConnection = {
  __typename?: 'UserProfileConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<UserProfileEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateUserProfileInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateUserProfileFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateUserProfilePayload = {
  __typename?: 'CreateUserProfilePayload';
  /** This is the created object. */
  userProfile: UserProfile;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserProfileInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateUserProfileFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateUserProfilePayload = {
  __typename?: 'UpdateUserProfilePayload';
  /** This is the updated object. */
  userProfile: UserProfile;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserProfileInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteUserProfilePayload = {
  __typename?: 'DeleteUserProfilePayload';
  /** This is the deleted object. */
  userProfile: UserProfile;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CreateWeaknessSetFieldsInput input type is used in operations that involve creation of objects in the WeaknessSet class. */
export type CreateWeaknessSetFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object packCodes. */
  packCodes?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object assignedCards. */
  assignedCards?: Maybe<Scalars['Object']>;
};

/** The UpdateWeaknessSetFieldsInput input type is used in operations that involve creation of objects in the WeaknessSet class. */
export type UpdateWeaknessSetFieldsInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object packCodes. */
  packCodes?: Maybe<Array<Maybe<Scalars['Any']>>>;
  /** This is the object assignedCards. */
  assignedCards?: Maybe<Scalars['Object']>;
};

/** Allow to link OR add and link an object of the WeaknessSet class. */
export type WeaknessSetPointerInput = {
  /** Link an existing object from WeaknessSet class. You can use either the global or the object id. */
  link?: Maybe<Scalars['ID']>;
  /** Create and link an object from WeaknessSet class. */
  createAndLink?: Maybe<CreateWeaknessSetFieldsInput>;
};

/** Allow to add, remove, createAndAdd objects of the WeaknessSet class into a relation field. */
export type WeaknessSetRelationInput = {
  /** Add existing objects from the WeaknessSet class into the relation. You can use either the global or the object ids. */
  add?: Maybe<Array<Scalars['ID']>>;
  /** Remove existing objects from the WeaknessSet class out of the relation. You can use either the global or the object ids. */
  remove?: Maybe<Array<Scalars['ID']>>;
  /** Create and add objects of the WeaknessSet class into the relation. */
  createAndAdd?: Maybe<Array<CreateWeaknessSetFieldsInput>>;
};

/** The WeaknessSetWhereInput input type is used in operations that involve filtering objects of WeaknessSet class. */
export type WeaknessSetWhereInput = {
  /** This is the object objectId. */
  objectId?: Maybe<IdWhereInput>;
  /** This is the object createdAt. */
  createdAt?: Maybe<DateWhereInput>;
  /** This is the object updatedAt. */
  updatedAt?: Maybe<DateWhereInput>;
  /** This is the object ACL. */
  ACL?: Maybe<ObjectWhereInput>;
  /** This is the object packCodes. */
  packCodes?: Maybe<ArrayWhereInput>;
  /** This is the object assignedCards. */
  assignedCards?: Maybe<ObjectWhereInput>;
  /** This is the object id. */
  id?: Maybe<IdWhereInput>;
  /** This is the OR operator to compound constraints. */
  OR?: Maybe<Array<WeaknessSetWhereInput>>;
  /** This is the AND operator to compound constraints. */
  AND?: Maybe<Array<WeaknessSetWhereInput>>;
  /** This is the NOR operator to compound constraints. */
  NOR?: Maybe<Array<WeaknessSetWhereInput>>;
};

/** The WeaknessSetRelationWhereInput input type is used in operations that involve filtering objects of WeaknessSet class. */
export type WeaknessSetRelationWhereInput = {
  /** Run a relational/pointer query where at least one child object can match. */
  have?: Maybe<WeaknessSetWhereInput>;
  /** Run an inverted relational/pointer query where at least one child object can match. */
  haveNot?: Maybe<WeaknessSetWhereInput>;
  /** Check if the relation/pointer contains objects. */
  exists?: Maybe<Scalars['Boolean']>;
};

/** The WeaknessSetOrder input type is used when sorting objects of the WeaknessSet class. */
export enum WeaknessSetOrder {
  ObjectIdAsc = 'objectId_ASC',
  ObjectIdDesc = 'objectId_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  AclAsc = 'ACL_ASC',
  AclDesc = 'ACL_DESC',
  PackCodesAsc = 'packCodes_ASC',
  PackCodesDesc = 'packCodes_DESC',
  AssignedCardsAsc = 'assignedCards_ASC',
  AssignedCardsDesc = 'assignedCards_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

/** The WeaknessSet object type is used in operations that involve outputting objects of WeaknessSet class. */
export type WeaknessSet = ParseObject & Node & {
  __typename?: 'WeaknessSet';
  /** The ID of an object */
  id: Scalars['ID'];
  /** This is the object id. */
  objectId: Scalars['ID'];
  /** This is the date in which the object was created. */
  createdAt: Scalars['Date'];
  /** This is the date in which the object was las updated. */
  updatedAt: Scalars['Date'];
  ACL: Acl;
  /** Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments */
  packCodes?: Maybe<Array<Maybe<ArrayResult>>>;
  /** This is the object assignedCards. */
  assignedCards?: Maybe<Scalars['Object']>;
};

/** An edge in a connection. */
export type WeaknessSetEdge = {
  __typename?: 'WeaknessSetEdge';
  /** The item at the end of the edge */
  node?: Maybe<WeaknessSet>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** A connection to a list of items. */
export type WeaknessSetConnection = {
  __typename?: 'WeaknessSetConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<WeaknessSetEdge>>>;
  /** This is the total matched objecs count that is returned when the count flag is set. */
  count: Scalars['Int'];
};

export type CreateWeaknessSetInput = {
  /** These are the fields that will be used to create the new object. */
  fields?: Maybe<CreateWeaknessSetFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateWeaknessSetPayload = {
  __typename?: 'CreateWeaknessSetPayload';
  /** This is the created object. */
  weaknessSet: WeaknessSet;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateWeaknessSetInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  /** These are the fields that will be used to update the object. */
  fields?: Maybe<UpdateWeaknessSetFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateWeaknessSetPayload = {
  __typename?: 'UpdateWeaknessSetPayload';
  /** This is the updated object. */
  weaknessSet: WeaknessSet;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteWeaknessSetInput = {
  /** This is the object id. You can use either the global or the object id. */
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteWeaknessSetPayload = {
  __typename?: 'DeleteWeaknessSetPayload';
  /** This is the deleted object. */
  weaknessSet: WeaknessSet;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Use Inline Fragment on Array to get results: https://graphql.org/learn/queries/#inline-fragments */
export type ArrayResult = Element | Role | Session | User | Campaign | Deck | Guide | PublicUser | UserFriends | UserProfile | WeaknessSet;

export type CreateFileInput = {
  /** This is the new file to be created and uploaded. */
  upload: Scalars['Upload'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateFilePayload = {
  __typename?: 'CreateFilePayload';
  /** This is the created file info. */
  fileInfo: FileInfo;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SignUpInput = {
  fields?: Maybe<CreateUserFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SignUpPayload = {
  __typename?: 'SignUpPayload';
  /** This is the new user that was created, signed up and returned as a viewer. */
  viewer: Viewer;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LogInWithInput = {
  authData: Scalars['Object'];
  fields?: Maybe<UserLoginWithInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UserLoginWithInput = {
  ACL?: Maybe<AclInput>;
  /** This is the object email. */
  email?: Maybe<Scalars['String']>;
  /** This is the object emailVerified. */
  emailVerified?: Maybe<Scalars['Boolean']>;
};

export type LogInWithPayload = {
  __typename?: 'LogInWithPayload';
  /** This is the new user that was created, signed up and returned as a viewer. */
  viewer: Viewer;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LogInInput = {
  /** This is the username used to log in the user. */
  username: Scalars['String'];
  /** This is the password used to log in the user. */
  password: Scalars['String'];
  /** Auth data payload, needed if some required auth adapters are configured. */
  authData?: Maybe<Scalars['Object']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LogInPayload = {
  __typename?: 'LogInPayload';
  /** This is the existing user that was logged in and returned as a viewer. */
  viewer: Viewer;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LogOutInput = {
  clientMutationId?: Maybe<Scalars['String']>;
};

export type LogOutPayload = {
  __typename?: 'LogOutPayload';
  /** It's always true. */
  ok: Scalars['Boolean'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  email: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  /** It's always true. */
  ok: Scalars['Boolean'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SendVerificationEmailInput = {
  email: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SendVerificationEmailPayload = {
  __typename?: 'SendVerificationEmailPayload';
  /** It's always true. */
  ok: Scalars['Boolean'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ChallengeInput = {
  /** This is the username used to log in the user. */
  username?: Maybe<Scalars['String']>;
  /** This is the password used to log in the user. */
  password?: Maybe<Scalars['String']>;
  /** Auth data allow to pre identify the user if the auth adapter need pre identification. */
  authData?: Maybe<Scalars['Object']>;
  /** Challenge data payload, could be used to post some data to auth providers if they need data for the response. */
  challengeData?: Maybe<Scalars['Object']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ChallengePayload = {
  __typename?: 'ChallengePayload';
  /** Challenge response from configured auth adapters. */
  challengeData?: Maybe<Scalars['Object']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

/** The CloudCodeFunction enum type contains a list of all available cloud code functions. */
export enum CloudCodeFunction {
  CurrentUserHandle = 'currentUserHandle',
  SocialUpdateHandle = 'socialUpdateHandle',
  SocialUpdateFriendRequest = 'socialUpdateFriendRequest',
  SocialSearchUsers = 'socialSearchUsers'
}

export type CallCloudCodeInput = {
  /** This is the function to be called. */
  functionName: CloudCodeFunction;
  /** These are the params to be passed to the function. */
  params?: Maybe<Scalars['Object']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CallCloudCodePayload = {
  __typename?: 'CallCloudCodePayload';
  /** This is the result value of the cloud code function execution. */
  result?: Maybe<Scalars['Any']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateClassInput = {
  /** This is the name of the object class. */
  name: Scalars['String'];
  /** These are the schema's fields of the object class. */
  schemaFields?: Maybe<SchemaFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateClassPayload = {
  __typename?: 'CreateClassPayload';
  /** This is the created class. */
  class: Class;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateClassInput = {
  /** This is the name of the object class. */
  name: Scalars['String'];
  /** These are the schema's fields of the object class. */
  schemaFields?: Maybe<SchemaFieldsInput>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateClassPayload = {
  __typename?: 'UpdateClassPayload';
  /** This is the updated class. */
  class: Class;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteClassInput = {
  /** This is the name of the object class. */
  name: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteClassPayload = {
  __typename?: 'DeleteClassPayload';
  /** This is the deleted class. */
  class: Class;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type GetMyCampaignsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCampaignsQuery = (
  { __typename?: 'Query' }
  & { currentUserHandle: (
    { __typename?: 'PublicUser' }
    & Pick<PublicUser, 'id' | 'handle'>
  ) }
);

export type GetUserHandleQueryVariables = Exact<{
  uid: Scalars['ID'];
}>;


export type GetUserHandleQuery = (
  { __typename?: 'Query' }
  & { publicUser: (
    { __typename?: 'PublicUser' }
    & Pick<PublicUser, 'id' | 'handle'>
  ) }
);

export type UpdateHandleMutationVariables = Exact<{
  handle: Scalars['String'];
}>;


export type UpdateHandleMutation = (
  { __typename?: 'Mutation' }
  & { updateHandle: (
    { __typename?: 'PublicUser' }
    & Pick<PublicUser, 'id' | 'handle'>
  ) }
);


export const GetMyCampaignsDocument = gql`
    query getMyCampaigns {
  currentUserHandle {
    id
    handle
  }
}
    `;

/**
 * __useGetMyCampaignsQuery__
 *
 * To run a query within a React component, call `useGetMyCampaignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCampaignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCampaignsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCampaignsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>) {
        return Apollo.useQuery<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>(GetMyCampaignsDocument, baseOptions);
      }
export function useGetMyCampaignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>) {
          return Apollo.useLazyQuery<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>(GetMyCampaignsDocument, baseOptions);
        }
export type GetMyCampaignsQueryHookResult = ReturnType<typeof useGetMyCampaignsQuery>;
export type GetMyCampaignsLazyQueryHookResult = ReturnType<typeof useGetMyCampaignsLazyQuery>;
export type GetMyCampaignsQueryResult = Apollo.QueryResult<GetMyCampaignsQuery, GetMyCampaignsQueryVariables>;
export const GetUserHandleDocument = gql`
    query getUserHandle($uid: ID!) {
  publicUser(id: $uid) {
    id
    handle
  }
}
    `;

/**
 * __useGetUserHandleQuery__
 *
 * To run a query within a React component, call `useGetUserHandleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserHandleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserHandleQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useGetUserHandleQuery(baseOptions: Apollo.QueryHookOptions<GetUserHandleQuery, GetUserHandleQueryVariables>) {
        return Apollo.useQuery<GetUserHandleQuery, GetUserHandleQueryVariables>(GetUserHandleDocument, baseOptions);
      }
export function useGetUserHandleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserHandleQuery, GetUserHandleQueryVariables>) {
          return Apollo.useLazyQuery<GetUserHandleQuery, GetUserHandleQueryVariables>(GetUserHandleDocument, baseOptions);
        }
export type GetUserHandleQueryHookResult = ReturnType<typeof useGetUserHandleQuery>;
export type GetUserHandleLazyQueryHookResult = ReturnType<typeof useGetUserHandleLazyQuery>;
export type GetUserHandleQueryResult = Apollo.QueryResult<GetUserHandleQuery, GetUserHandleQueryVariables>;
export const UpdateHandleDocument = gql`
    mutation updateHandle($handle: String!) {
  updateHandle(handle: $handle) {
    id
    handle
  }
}
    `;
export type UpdateHandleMutationFn = Apollo.MutationFunction<UpdateHandleMutation, UpdateHandleMutationVariables>;

/**
 * __useUpdateHandleMutation__
 *
 * To run a mutation, you first call `useUpdateHandleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHandleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHandleMutation, { data, loading, error }] = useUpdateHandleMutation({
 *   variables: {
 *      handle: // value for 'handle'
 *   },
 * });
 */
export function useUpdateHandleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHandleMutation, UpdateHandleMutationVariables>) {
        return Apollo.useMutation<UpdateHandleMutation, UpdateHandleMutationVariables>(UpdateHandleDocument, baseOptions);
      }
export type UpdateHandleMutationHookResult = ReturnType<typeof useUpdateHandleMutation>;
export type UpdateHandleMutationResult = Apollo.MutationResult<UpdateHandleMutation>;
export type UpdateHandleMutationOptions = Apollo.BaseMutationOptions<UpdateHandleMutation, UpdateHandleMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ParseObject": [
      "Role",
      "Session",
      "User",
      "Campaign",
      "Deck",
      "Guide",
      "PublicUser",
      "UserFriends",
      "UserProfile",
      "WeaknessSet"
    ],
    "Node": [
      "Role",
      "Session",
      "User",
      "Campaign",
      "Deck",
      "Guide",
      "PublicUser",
      "UserFriends",
      "UserProfile",
      "WeaknessSet"
    ],
    "SchemaField": [
      "SchemaStringField",
      "SchemaNumberField",
      "SchemaBooleanField",
      "SchemaArrayField",
      "SchemaObjectField",
      "SchemaDateField",
      "SchemaFileField",
      "SchemaGeoPointField",
      "SchemaPolygonField",
      "SchemaBytesField",
      "SchemaPointerField",
      "SchemaRelationField",
      "SchemaACLField"
    ],
    "ArrayResult": [
      "Element",
      "Role",
      "Session",
      "User",
      "Campaign",
      "Deck",
      "Guide",
      "PublicUser",
      "UserFriends",
      "UserProfile",
      "WeaknessSet"
    ]
  }
};
      export default result;
    