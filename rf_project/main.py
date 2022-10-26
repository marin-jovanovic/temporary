import math
import struct
from collections import namedtuple


def get_partition_identifiers():

    with open("type.txt") as f:
        res = f.read()
        d = {}
        for i in res.split("\n"):
            i = i.split(" ", 1)
            d[i[0]] = i[1][1:]

        return d

class Partition:

    def __init__(
        self,
        boot_indicator,
        starting_head,
        starting_sector,
        starting_cylinder,
        system_id,
        ending_head,
        ending_sector,
        ending_cylinder,
        relative_sectors,
        total_sectors
    ):

        self.boot_indicator = boot_indicator
        self.starting_head = starting_head
        self.starting_sector = starting_sector
        self.starting_cylinder = starting_cylinder
        self.system_id = system_id
        self.ending_head = ending_head
        self.ending_sector = ending_sector
        self.ending_cylinder = ending_cylinder
        self.relative_sectors = relative_sectors
        self.total_sectors = total_sectors

    @staticmethod
    def cyl_sector(sector_cyl, cylinder7_0):
        sector = sector_cyl & 0x1F  # bits 5-0
        # bits 7-6 of sector_cyl contain bits 9-8 of the cylinder
        cyl_high = (sector_cyl >> 5) & 0x03
        cyl = (cyl_high << 8) | cylinder7_0
        return sector, cyl

    def get_status(self):
        if self.boot_indicator == 0x80:
            pass
            # print("Bootable", )
        elif self.boot_indicator == 0x00:
            pass
            # print("not active")
        elif self.boot_indicator:
            print("Unknown status [%s]" % hex(self.boot_indicator), )
            raise Exception("err")
            print("Type=0x%x" % self.system_id)
            start = (self.starting_head,) + Partition.cyl_sector(self.starting_sector, self.starting_cylinder)
            end = (self.ending_head,) + Partition.cyl_sector(self.ending_sector, self.ending_cylinder)
            print(" (Start: Heads:%i\tCyl:%i\tSect:%i)" % start)
            print(" (End: Heads:%i\tCyl:%i\tSect:%i)" % end)
            print(" LBA:", self.relative_sectors)
            print(" Blocks:", self.total_sectors)

    def is_active(self):
        return self.boot_indicator == 0x80

    def info(self):
        print("partition table metadata")
        print(f"status = {'active' if self.boot_indicator == 0x80 else 'other'}")
        print(f"start HSC = {self.starting_head} {self.starting_sector} {self.starting_cylinder}")
        print(f"system id = {self.system_id}")
        print(f"end HSC = {self.ending_head} {self.ending_sector} {self.ending_cylinder}")
        print(f"starting sector = {self.relative_sectors = }")

        partition_start = self.relative_sectors * 512
        print(f"{partition_start=} (int), {hex(partition_start)} (hex)")
        # todo
        superblock_start = partition_start + 1024
        # superblock_start = partition_start
        print(f"{superblock_start=} (int), {hex(superblock_start)} (hex)")

        size_b = self.total_sectors * 512
        size_kib = size_b / 1024
        size_mib = size_kib / 1024
        print(f"partition size = {self.total_sectors} [sectors] = {size_b} [B] = {size_kib} [kiB] = {size_mib} [MiB]")

    def get_partition_start(self):
        return self.relative_sectors * 512

    def get_superblock_start(self):
        partition_start = self.relative_sectors * 512
        superblock_start = partition_start + 1024
        return superblock_start

    def get_partition_size_in_B(self):
        return self.total_sectors * 512

    def guess_system_id(self):
        print("guess system id")
        part_ids = get_partition_identifiers()

        t = str(hex(self.system_id))[2:]
        if len(t) == 1:
            t += "0"

        print(t)
        print(f"im guessing it is : {part_ids[t]}, but please check:")
        print("https://www.win.tue.nl/~aeb/partitions/partition_types-1.html")

class Superblock:

    def __init__(self, s_inodes_count, s_blocks_count_lo, s_r_blocks_count_lo, s_free_blocks_count_lo, s_free_inodes_count, s_first_data_block, s_log_block_size, s_log_cluster_size, s_blocks_per_group, s_clusters_per_group, s_inodes_per_group, s_mtime):
        self.s_inodes_count = s_inodes_count
        self.s_blocks_count_lo = s_blocks_count_lo
        self.s_r_blocks_count_lo = s_r_blocks_count_lo
        self.s_free_blocks_count_lo = s_free_blocks_count_lo
        self.s_free_inodes_count = s_free_inodes_count
        self.s_first_data_block = s_first_data_block
        self.s_log_block_size = s_log_block_size
        self.s_log_cluster_size = s_log_cluster_size
        self.s_blocks_per_group = s_blocks_per_group
        self.s_clusters_per_group = s_clusters_per_group
        self.s_inodes_per_group = s_inodes_per_group
        self.s_mtime = s_mtime

    def info(self):
        print("superblock metadata")


        size_32 =  "__le32"
        Row = namedtuple('Row', ["value", 'offset', 'size', 'name', "description"])

        lista = [
            Row(value=self.s_inodes_count,offset=0x0, size=size_32, name="s_inodes_count", description="Total inode count."),
            Row(value=self.s_blocks_count_lo,offset=0x4, size=size_32, name="s_blocks_count_lo", description="Total block count."),
            Row(value=self.s_r_blocks_count_lo,offset=0x8, size=size_32, name="s_r_blocks_count_lo", description="This number of blocks can only be allocated by the super-user."),
            Row(value=self.s_free_blocks_count_lo,offset=0xC, size=size_32, name="s_free_blocks_count_lo", description="Free block count."),
            Row(value=self.s_free_inodes_count,offset=0x10, size=size_32, name="s_free_inodes_count", description="Free inode count."),
            Row(value=self.s_first_data_block,offset=0x14, size=size_32, name="s_first_data_block", description="First data block. This must be at least 1 for 1k-block filesystems and is typically 0 for all other block sizes."),
            Row(value=self.s_log_block_size,offset=0x18, size=size_32, name="s_log_block_size", description="Block size is 2 ^ (10 + s_log_block_size)."),
            Row(value=self.s_log_cluster_size,offset=0x1C, size=size_32, name="s_log_cluster_size", description="Cluster size is (2 ^ s_log_cluster_size) blocks if bigalloc is enabled, zero otherwise."),
            Row(value=self.s_blocks_per_group,offset=0x20, size=size_32, name="s_blocks_per_group", description="Blocks per group."),
            Row(value=self.s_clusters_per_group,offset=0x24, size=size_32, name="s_clusters_per_group", description="Clusters per group, if bigalloc is enabled."),
            Row(value=self.s_inodes_per_group,offset=0x28, size=size_32, name="s_inodes_per_group", description="Inodes per group."),
            Row(value=self.s_mtime,offset=0x2C, size=size_32, name="s_mtime", description="Mount time, in seconds since the epoch."),

        ]
        # print(f"{/lista[6].name} = {lista[6].value}")
        # print(2 **(10 + lista[6].value))

        for i in lista:
            print(f"{i.name} = {i.value}")

        print()

    def check_block_size_count(self, partition_size):
        try:
            print("partition_size / s_blocks_count_lo = ")
            print(f"{partition_size} / {self.s_blocks_count_lo} = ")
            print(f"{partition_size} / {self.s_blocks_count_lo} = {partition_size / self.s_blocks_count_lo}")
            r = partition_size / self.s_blocks_count_lo
            # print(math.log(r, 2) - 10)
            print()
        except:
            print("cant")

        # try:
        #     print(f"{partition_size} / {self.s_blocks_per_group}")
        #     print(f"{partition_size} / {self.s_blocks_per_group} = {partition_size / self.s_blocks_per_group}")
        #     r = partition_size / self.s_blocks_per_group
        #     print(math.log(r, 2) - 10)
        # except:
        #     print("cant")
        #
        # try:
        #     print(f"{partition_size} / {self.s_clusters_per_group}")
        #     print(f"{partition_size} / {self.s_clusters_per_group} = {partition_size / self.s_clusters_per_group}")
        #     r = partition_size / self.s_clusters_per_group
        #     print(math.log(r, 2) - 10)
        # except:
        #     print("cant")

        # r = 4096
        # v = math.log(r, 2) - 10
        # print(v)

        superblock_size = 1024

        if self.s_blocks_count_lo == 0:
            print(f"zero division error on {self.s_blocks_count_lo}")
            return -1

        correct_size = (partition_size - superblock_size) / self.s_blocks_count_lo

        count = 0

        while correct_size % 2 == 0 and correct_size != 2:
            correct_size /= 2
            count += 1

        if correct_size == int(correct_size):
            # print("round ok")
            pass
        else:
            # print("round error", correct_size)
            if math.floor(correct_size) % 2 == 0:
                correct_size = math.floor(correct_size)
            else:
                correct_size = math.ceil(correct_size)
            print("new correct size", correct_size)
            # raise Exception("round error")

        while correct_size % 2 == 0 and correct_size != 2:
            correct_size /= 2
            count += 1


        # print("block size = 2 ** (10 + s_log_block_size) = ")
        # print(f"block size = 2 ** (10 + {self.s_log_block_size}) = ")
        # print(f"block size = {2 ** (10 + self.s_log_block_size)}")
        print()

        if int(correct_size) == self.s_log_block_size:
            print("block size ok")
        else:
            print(f"block size error: calculated {int(correct_size)}, got {self.s_log_block_size}")

        return int(correct_size)

def get_partitions(partition_table, signature):

    little_endian = get_endian(get_constants()['magic_number'], signature)

    PART_FMT = (little_endian and '<' or '>') + (
        "B"  # status (0x80 = bootable (active), 0x00 = non-bootable) 
        # CHS of first block 
        "B"  # Head 
        "B"  # Sector is in bits 5; bits 9 of cylinder are in bits 7-6 
        "B"  # bits 7-0 of cylinder 
        "B"  # partition type 
        # CHS of last block 
        "B"  # Head 
        "B"  # Sector is in bits 5; bits 9 of cylinder are in bits 7-6 
        "B"  # bits 7-0 of cylinder 
        "L"  # LBA of first sector in the partition 
        "L"  # number of blocks in partition, in little-endian format
    )

    fmt_size = struct.calcsize(PART_FMT)
    # sanity check expectations
    assert fmt_size == get_constants()["partition_size"], "Partition format string is %i bytes, not %i" % (
    fmt_size, get_constants()['partition_size'])

    r = []
    for partition in range(get_constants()["part_count"]):
        offset = get_constants()["partition_size"] * partition

        t = struct.unpack(PART_FMT, partition_table[offset:offset + get_constants()["partition_size"]])
        # print(t)
        # print(partition_table[offset:offset + get_constants()["partition_size"]])

        r.append(
            Partition(*struct.unpack(PART_FMT, partition_table[offset:offset + get_constants()["partition_size"]]))
        )

    with open("partitions", "wb") as f3:

        for partition in range(get_constants()["part_count"]):
            offset = get_constants()["partition_size"] * partition

            t = struct.unpack(PART_FMT,
                              partition_table[offset:offset + get_constants()["partition_size"]]
                              )
            f3.write(partition_table[offset:offset + get_constants()["partition_size"]]
                              )
            # print(t)

    return r

def get_constants():
    return {
        "magic_number": 0xaa55,
        # todo
        "magic_number_len": 2,
        "part_count": 4,
        "partition_size": 16,
        "partition_table_start": 446
    }


def get_endian(magic_number, signature):
    # todo check other
    little_endian = (signature == magic_number)  # should be True
    # print(signature)
    # print("Little endian:", little_endian)
    # if signature == magic_number:
    #     print("magic number ok")
    # else:
    #     print("magic number error")
    #     raise Exception("magic number error")
    # print()
    return little_endian


def corrected_value_formatted(value):
    return struct.pack(
        '<' + (1 * "L"),
        *(
            value,
        )
    )

def write_file(filename, content, where, injected):
    with open(filename, "wb") as f3:
        f3.write(
            # device_image
            content[:where] +
            injected +
            content[where + len(injected):]
        )


def main():

    p = "/deviceImageCorrupted.raw"

    with open(p, "rb") as f:
        device_image = f.read()

        # ignore start of master boot record (mbr)

        c = get_constants()['partition_table_start'] + \
            get_constants()['part_count'] * \
            get_constants()["partition_size"]

        partition_table = device_image[get_constants()["partition_table_start"]:c]

        signature = struct.unpack(
            '<H',
            device_image[
                c:
                c + get_constants()["magic_number_len"]
            ]
        )[0]

        little_endian = get_endian(get_constants()['magic_number'], signature)
        # todo
        # little_endian = False
        partitions = get_partitions(partition_table, signature)

        # works only on ext4
        for i, p in enumerate(partitions):
            print(80 * "-")
            print(f"partition {i}")
            print()
            if p.boot_indicator == 0 and \
                p.starting_head == 0 and \
                p.starting_sector == 0 and \
                p.starting_cylinder == 0 and \
                p.system_id == 0 and \
                p.ending_head == 0 and \
                p.ending_sector == 0 and \
                p.ending_cylinder == 0 and \
                p.relative_sectors == 0 and \
                p.total_sectors == 0:
                print("skipping")
                continue

            # fixme
            # if p.get_superblock_start() != 1024:
            #     print("recoverable")

            p.get_status()
            p.info()
            print()
            if not p.system_id == 0:
                p.guess_system_id()
            print()

            ext_superblock_scheme = (little_endian and '<' or '>') + ( 12 * "L")

            superblock = Superblock(*struct.unpack(ext_superblock_scheme, device_image[p.get_superblock_start(): p.get_superblock_start() + (len(ext_superblock_scheme) - 1) * 4 ]))

            with open("p", "wb") as f3:
                f3.write(
                     device_image[p.get_superblock_start(): p.get_superblock_start() + (
                                len(ext_superblock_scheme) - 1) * 4]
                )

            superblock.info()

            s_log_block_size = superblock.check_block_size_count(p.get_partition_size_in_B())
            # s_log_block_size = superblock.check_block_size_count(0)

            if s_log_block_size == -1:
                print("can not repair, skipping")
                continue

            # todo for correcting
            superblock_corrected = corrected_value_formatted(s_log_block_size)
            # superblock_corrected = corrected_value_formatted(2551)
            print("new s_log_block_size =",s_log_block_size)
            print(f"{superblock_corrected = }")

            with open("correct", "wb") as f3:
                    f3.write(
                        superblock_corrected
                    )

            write_file("out.raw", device_image, p.get_superblock_start() + 24, superblock_corrected)


if __name__ == '__main__':
    main()

