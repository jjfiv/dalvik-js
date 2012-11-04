# UNIX timestamp concatenated with nanoseconds
T="$(date +%s%N)"

# Do some work here
java Benchmark

# Time interval in nanoseconds
T="$(($(date +%s%N)-T))"
# Seconds
S="$((T/1000000000))"
# Milliseconds
M="$((T/1000000))"

echo "Execution Time: $M"

