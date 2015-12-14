import pandas as pd
import numpy as np



def concat(*args):
    strs = [str(arg) for arg in args if not pd.isnull(arg)]
    return '-'.join(strs) if strs else np.nan
np_concat = np.vectorize(concat)


def hours(t):
    """
    Helper function, takes an hour in format hhmm or hmm and
    returns just hh.
    """

    try:
        t = float(t)
    except:
        return np.nan

    t = str(t).split(".")[0]
    if len(t) == 3:
        return t[:1]
    else:
        return t[:2]

data_files = ["2008"]
def group_data_by(group=["Date"]):
    """
    Transforms the RITA original CSV files into smaller CSV files using
    pandas group methods.
    """

    grouped_list = []

    # Read each file independently
    for file in data_files:
        print "Starting to read: {}".format(file)

        # read file to dataframe and add a column for Datetime
        data = pd.read_csv("data/original/{}.csv".format(file))
        data["Time"] = data["DepTime"].map(hours)
        data["DateTime"] = np_concat(data["Year"], data["Month"], data["DayofMonth"], data["Time"])


        grouped_data = data.groupby(group)
        transformed = grouped_data.transform('count')
        summed = transformed.mean()

        grouped_list.append(grouped_data)

    # To append all years into a single DT
    all_data = grouped_list.pop(0)
    for year in grouped_list:
        all_data.append(year)


    # Save to new CSV
    all_data.to_csv("data/2008-{0}.csv".format(group[0]))

group_data_by(group=[ "DateTime"])




def hours(t):
    try:
        t = float(t)
    except:
        return np.nan

    t = str(t).split(".")[0]
    if len(t) == 3:
        return t[:1]
    else:
        return t[:2]
