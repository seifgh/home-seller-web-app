from django_pandas.io import read_frame # here i used django_padas to work easier with django models
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ModelSuggestions:

    def __init__(self, query_set, features):

        self.query_set = query_set

        if 'pk' not in features:
            features.append('pk')
        self.features = features

        self.data_frame = read_frame(query_set, fieldnames=features)

        # add combined column to data frame for vectorizing
        self.data_frame['combined'] = self.getCombinedColumn()

        # cosine similarities will contain a matrix
        # of scores calculated from vectors using math functions
        self.cosine_similarities = self.calcCosineSimilarities()


    def combineColumns(self, row):
        return ''.join( (str(row[col]) + ' ') for col in self.features[1:] )[:-1]

    def getCombinedColumn(self):
        return self.data_frame.apply(self.combineColumns, axis='columns')


    def calcCosineSimilarities(self):
        # give each combined row a matching vector
        cv = CountVectorizer()
        count_matrix = cv.fit_transform(self.data_frame['combined'])

        return cosine_similarity(count_matrix)


    def turnIndexesToQuerySet(self, indexes):
        # get primary keys of objects from data frame
        primary_keys = [ self.data_frame.loc[i]['pk'] for i in indexes ]

        # turn them to querySet
        return self.query_set.filter(pk__in=primary_keys)


    def getTopSuggestions(self, top, pk):
        # just for checking if object exists if not will throw an error
        target = self.query_set.get(pk=pk)

        target_index = self.data_frame[self.data_frame['pk'] == pk].index[0]

        # target_similars_scores will contain
        # a list of ( index, score between 0 and 1 ), ...
        target_similars_scores = list(enumerate(self.cosine_similarities[target_index]))

        # short by score then get top similars
        indexes_of_top_similars = [ tup[0] for tup in sorted(target_similars_scores, reverse=True, key=lambda tup: tup[1]) ][1:top+1]

        return self.turnIndexesToQuerySet(indexes_of_top_similars)
