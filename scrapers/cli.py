from optparse import OptionParser

parser = OptionParser()
parser.add_option("-n", "--name", dest="name", help="name for data record")
parser.add_option("-f", "--file", dest="source", help="read from FILE", metavar="FILE")
parser.add_option("-o", "--output-file", metavar="OUTPUT_FILE", dest="outputFile", help="write to OUTPUT_FILE")
parser.add_option("-v", "--verbose", dest="verbose", default=False, help="Print to stdout", action="store_true")

(options, args) = parser.parse_args()

if (not options.name):   # if filename is not given
    parser.error('Name required for JSON record')

def getOptions():
    return (options, args)
