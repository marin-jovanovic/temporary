from constants import INPUT_PATH


def get_input():
  lines = open(INPUT_PATH, "r")

  clean_input = list()

  for line in lines:
    l = list(line)
    for i in l:
      clean_input.append(i)

      # clean_inpute)

  # print(clean_input)
  return clean_input


if __name__ == '__main__':
  input = get_input()
  print(input)

  curr_line = list()
  curr_line_length = 0

  output = list()

  for curr_token in input:

    index = input.index(curr_token)

    if index >= len(curr_line):

      if index != len(curr_line):

        for i in range(len(curr_line), index):
          curr_line.append("_")

      curr_line.append(curr_token)

    else:
      temp = list()
      for i in curr_line:
        temp.append(i)



      curr_line.clear()

      # print(index)
      for i in range(0, index):
        curr_line.append("_")

      curr_line.append(curr_token)


      output.append(temp)


  output.append(curr_line)

  for line in output:
    print(line)
