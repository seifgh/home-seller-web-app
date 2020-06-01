# Property suggestions ( Content based recommendation engine )
# Here i'm using Cosine similarity between vectors to get top 12 suggestions

from django_pandas.io import read_frame # here i used django_padas to work easier with django models
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from wshouses.models import Property # django model ( like data.csv )

qs = Property.objects.filter(satus='fs') # (fs => for sale)
features = [
    'id',
    # location
    'location__street__latitude',
    'location__street__longitude',
    'location__street__name',
    'location__street__city__name',
    'location__street__city__state__name',
    'location__street__city__state__country__name',
    # specifications
    'price',
    'floor_space',
    'is_furnished',
    'has_swimming_pool',
    'has_heating_and_colling',
    'balconies_number',
    'bedrooms_number',
    'bathrooms_number',
    'parking_spaces_number',
    'garages_number'
]
df = read_frame(qs, fieldnames=features)

# get a row and turn it to str
def combineColumns(row, columns=fieldnames[1:]):
    result = ''
    for column in columns:
        result += str(row[column]) + " "
    return result[:-1]

df['combined'] = df.apply(combineColumns, axis='columns')

# get the count matrix(give each combined row a matching vector)

cv = CountVectorizer()
matrix = cv.fit_transform(df['combined'])

# get the cosine similarity of all vectors

cos_similarity = cosine_similarity(matrix)


# get top 10 suggesions for a product

def getTopSimilarProducts(property_id, top=10):
    property_index = df[df['id'] == property_id].index[0]
    similar_properties = list(enumerate(cos_similarity[property_index]))
    top_similar_indexes = [i[0] for i in sorted(similar_properties, key = lambda x: x[1], reverse = True)[1: top + 1]]
    
    return [df.loc[i]['id'] for i in top_similar_indexes]