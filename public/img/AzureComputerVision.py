import requests
import sys
sys.path.append("./../")
import config
_URL = config.ONBOARDING["AZURE"]["URL"]
_HEADERS = {'Ocp-Apim-Subscription-Key': config.ONBOARDING["AZURE"]["KEY"]}

class OCR():
    @staticmethod
    def imageToArrayLines(image):
        payload = {'image':image}
        response = requests.post(_URL, headers=_HEADERS, files=payload)
        result = response.json()
        linesText = []
        for region in result["regions"]:
            for line in region["lines"]:
                lineText = ""
                for word in line["words"]:
                    lineText = "{} {}".format(lineText,word["text"])
                linesText.append(lineText)
        return linesText