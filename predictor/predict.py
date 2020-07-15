import pickle
import sys
import os

data = sys.argv[1]
data = [data]

this_dir, this_filename = os.path.split(__file__)
Pkl_Filename = os.path.join(this_dir, "Pickle_NB_Model.pkl")
vectorize_Filename = os.path.join(this_dir, "vectorize.pkl")
encoder_Filename = os.path.join(this_dir, "encoder.pkl")

with open(Pkl_Filename, 'rb') as file:
    Pickled_NB_Model = pickle.load(file)

with open(vectorize_Filename, 'rb') as file:
    vectorizer = pickle.load(file)

with open(encoder_Filename, 'rb') as file:
    encoder = pickle.load(file)

saved_model = pickle.load(open(Pkl_Filename,'rb'))

Xte = vectorizer.transform(data)

x_test = data
y_pred = encoder.inverse_transform(Pickled_NB_Model.predict(Xte)).tolist()
print(y_pred[0])
# prediction = pd.DataFrame({'Title':x_test,'Predicted':y_pred})

# print(prediction)
