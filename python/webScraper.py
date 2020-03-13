import requests
from bs4 import BeautifulSoup
page = requests.get("https://bigseventravel.com/2019/08/50-most-visited-cities-in-the-world/")
soup = BeautifulSoup(page.content, 'html.parser')
# print(soup.prettify())
# html = soup.find_all('h3')
count = 0
listOfCities = []
for i in range(60):
    href = (list(soup.find_all('h3'))[i+2])
    href = list(href.children)[0]
    try:
        href = (list((href).children))[0]
    except:
        pass
    if(href[0].isnumeric()):
        count+=1
        listOfCities.append(href)

listOfCitiesClean = []
for i in listOfCities:
    start = i.index(' ')
    end = i.index(' –')
    listOfCitiesClean.append(i[start+1:end])
listOfCitiesClean.reverse()
print(listOfCitiesClean)